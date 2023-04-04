import asyncio
from collections import Counter, OrderedDict
from dataclasses import dataclass, field
import json
import re
from pathlib import Path
from typing import Any
from pyppeteer import launch
from bs4 import BeautifulSoup
from tqdm import tqdm


def name_to_filename(name: str) -> Path:
    folder = Path('scripts')
    file = Path(f'{name.lower()}_team_list.json')
    return folder / file

async def getTeamListURLs(page, roster_url: str) -> list[dict]:
    # Go to the roster page
    await page.goto(roster_url)

    # Click the Show <select> Entries select, then click the option with the value of -1
    await page.select('select[name="dtLiveRoster_length"]', '-1')
    html = await page.content()

    # Parse the HTML to get the table rows
    soup = BeautifulSoup(html, 'html.parser')
    table = soup.find('table', id='dtLiveRoster')
    table_headers = [th.text for th in table.find('thead').find_all('th')]
    table_rows = table.find('tbody').find_all('tr')

    # Build a list of dicts with the table data
    team_list_rows: list[dict] = []
    for row in table_rows:
        # Skip if no team view link
        team_link = row.find('a')
        if team_link is None:
            continue
        d = {}
        for header, cell in zip(table_headers, row.find_all('td')):
            d[header] = cell.text.strip(
            ) if header != 'Team List' else 'https://www.rk9.gg' + team_link['href']
        team_list_rows.append(d)

    return team_list_rows


async def getTeamList(page, team_list_url: str) -> list[dict]:
    # Go to the team list page
    await page.goto(team_list_url)

    # Get Pokemon via class name "pokemon"
    pokemon = await page.querySelectorAll("#lang-EN .pokemon")

    # Get the Pokemon's name, Tera Type, Ability, Held Item, and moves
    team_list = []
    for p in pokemon:
        d = {'teraType': None, 'ability': None, 'item': None}
        # Each p is a div. Some properties are not wrapped by tags, so we need to parse the innerHTML
        innerHTML = await (await p.getProperty('innerHTML')).jsonValue()
        # remove &nbsp; and all elements wrapped by a tag, including the tags and their contents
        innerHTML = re.sub(r'<[^>]+>', '', innerHTML).replace('&nbsp;', '')
        # split the innerHTML and remove empty strings
        elements = [s.strip() for s in innerHTML.splitlines() if s.strip()]
        # remove all elements that contain " or EN
        elements = [s for s in elements if not re.search(r'\"|EN', s)]
        for i, e in enumerate(elements):
            if i == 0:
                d['name'] = e
                continue
            pair = e.split(": ")
            if len(pair) < 2:
                continue
            if e.startswith('Tera Type'):
                d['teraType'] = pair[1].strip()
            elif e.startswith('Ability'):
                d['ability'] = pair[1].strip()
            elif e.startswith('Held Item'):
                d['item'] = pair[1].strip()
        # Get the Pokemon's moves from p -> <h5> -> <span>s
        d['moves'] = await p.querySelectorAll('h5 > span')
        d['moves'] = [await (await m.getProperty('textContent')).jsonValue() for m in d['moves']]
        team_list.append(d)

    return team_list


async def scrape(rk9_roster_pages: dict[str, str], overwrite: bool = False):
    browser = await launch()
    page = await browser.newPage()
    for name, url in rk9_roster_pages.items():
        # Skip if the file already exists
        filename = name_to_filename(name)
        if not overwrite and filename.exists():
            print(f"Skipping {name} because {filename} already exists")
            continue

        # Scrape the team list
        print(f"Getting team list for {name}...")
        team_list = await getTeamListURLs(page, url)
        # drop teams from non-master divisions
        team_list = [t for t in team_list if t['Division'] == 'Masters']
        # ensure all teams have a standing
        max_standing = len(team_list) + 1
        for t in team_list:
            if not t.get('Standing'):
                t['Standing'] = max_standing
        # sort the team list by "Standing"
        team_list.sort(key=lambda x: int(x['Standing']))
        for team in tqdm(team_list):
            del team["Player ID"]  # not needed
            # populate the team list
            team['Team'] = await getTeamList(page, team['Team List'])
            team['Standing'] = int(team['Standing'])  # convert to int

        # Dump the team list to a JSON file in encoding UTF-8
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(team_list, f)
        print(f"Done getting team list for {name} w/ length: {len(team_list)}")
    await page.close()
    await browser.close()


def replace_name_with_showdown_compatible(team_list: list[dict[str, Any]]) -> list[dict[str, Any]]:
    name_dict = {
        "Tatsugiri [Curly Form]": "Tatsugiri",
        "Tatsugiri [Droopy Form]": "Tatsugiri-Droopy",
        "Tatsugiri [Stretchy Form]": "Tatsugiri-Stretchy",
        "Indeedee [Female]": "Indeedee-F",
        "Indeedee [Male]": "Indeedee",
        "Lycanroc [Midday Form]": "Lycanroc",
        "Lycanroc [Midnight Form]": "Lycanroc-Midnight",
        "Lycanroc [Dusk Form]": "Lycanroc-Dusk",
        "Rotom [Wash Rotom]": "Rotom-Wash",
        "Rotom [Frost Rotom]": "Rotom-Frost",
        "Rotom [Fan Rotom]": "Rotom-Fan",
        "Rotom [Mow Rotom]": "Rotom-Mow",
        "Rotom [Heat Rotom]": "Rotom-Heat",
        "Tauros [Paldean Form - Aqua Breed]": "Tauros-Paldea-Aqua",
        "Tauros [Paldean Form - Blaze Breed]": "Tauros-Paldea-Blaze",
        "Tauros [Paldean Form - Combat Breed]": "Tauros-Paldea-Combat",
        "Toxtricity [Amped Form]": "Toxtricity",
        "Toxtricity [Low Key Form]": "Toxtricity-Low-Key",
        "Oricorio [Baile Style]": "Oricorio",
        "Oricorio [Sensu Style]": "Oricorio-Sensu",
        "Oricorio [Pom-Pom Style]": "Oricorio-Pom-Pom",
        "Oricorio [Pa'u Style]": "Oricorio-Pa'u",
    }
    for team in team_list:
        for p in team['Team']:
            p['name'] = name_dict.get(p['name'], p['name'])
    return team_list

def add_pokepaste(team_list: list[dict[str, Any]]) -> list[dict[str, Any]]:
    for team in team_list:
        team['PokePaste'] = team_to_pokepaste(team['Team'])
    return team_list

def team_to_pokepaste(team: list[dict]) -> str:
    # Get the Pokemon's name, Tera Type, Ability, Held Item, and moves
    pokepaste = []
    for p in team:
        pokepaste.append(f"{p['name']} " + f"@ {p['item']}" if p['item'] else "")
        if p['ability']:
            pokepaste.append(f"Ability: {p['ability']}")
        pokepaste.append("Level: 50")
        if p['teraType']:
            pokepaste.append(f"Tera Type: {p['teraType']}")
        for move in p['moves']:
            pokepaste.append(f"- {move}")
        pokepaste.append("")
    return " \r\n".join(pokepaste)

@dataclass(order=True, frozen=False)
class Usage:
    name: str
    abilities: Counter[str, int] = field(
        default_factory=Counter)  # ability -> count
    items: Counter[str, int] = field(
        default_factory=Counter)  # item -> count
    moves: Counter[str, int] = field(
        default_factory=Counter)  # move -> count
    teammates: Counter[str, int] = field(
        default_factory=Counter)  # pokemon -> count
    teraTypes: Counter[str, int] = field(
        default_factory=Counter)  # teraType -> count
    count = 0  # number of times this pokemon is used
    usage = 0.0  # percentage

    def __str__(self) -> str:
        d = {
            'name': self.name,
            'abilities': dict(self.abilities),
            'items': dict(self.items),
            'moves': dict(self.moves),
            'teammates': dict(self.teammates),
            'teraTypes': dict(self.teraTypes),
            'count': self.count,
            'usage': self.usage
        }
        return json.dumps(d, indent=2)

    def sort(self):
        '''
        Sorts the dictionaries by value in descending order
        '''
        self.abilities = {k: v for k, v in self.abilities.most_common()}
        self.items = {k: v for k, v in self.items.most_common()}
        self.moves = {k: v for k, v in self.moves.most_common()}
        self.teammates = {k: v for k, v in self.teammates.most_common()}
        self.teraTypes = {k: v for k, v in self.teraTypes.most_common()}


class Statistic:
    def __init__(self, filename: str):
        self.filename = filename
        self.data = []
        self.load()

    def load(self):
        '''
        Loads the JSON file into self.data
        '''
        with open(self.filename, 'r', encoding='utf-8') as f:
            self.data = json.load(f)

    def count(self, key: str, top_standing: int | None = 32) -> Counter[str, int]:
        '''
        Counts the number of times a key appears in the team list

        Args:
            key (str): The key to count
            top_standing (int | None, optional): The top standings to count. Defaults to 32.

        Returns:
            Counter[str, int]: A counter of the key
        '''
        counter = Counter()
        for team in self.data:
            if top_standing is not None and team['Standing'] > top_standing:
                continue
            for p in team['Team']:
                counter[p[key]] = counter.get(p[key], 0) + 1
        return counter

    def getUsage(self, top_standing: int | None = 32) -> OrderedDict[str, Usage]:
        '''
        Gets the usage of each pokemon

        Args:
            top_standing (int | None, optional): The top standings to count. Defaults to 32.

        Returns:
            OrderedDict[str, Usage]: A dictionary of pokemon name to Usage
        '''
        usages: dict[str, Usage] = {}
        for team in self.data:
            if top_standing is not None and team['Standing'] > top_standing:
                continue
            for p in team['Team']:
                key = p['name']
                ability, item, moves, teraType = p['ability'], p['item'], p['moves'], p['teraType']
                if key not in usages:
                    usages[key] = Usage(key)
                usages[key].count += 1
                usages[key].abilities[ability] = usages[key].abilities.get(
                    ability, 0) + 1
                usages[key].items[item] = usages[key].items.get(item, 0) + 1
                usages[key].teraTypes[teraType] = usages[key].teraTypes.get(
                    teraType, 0) + 1
                for m in moves:
                    usages[key].moves[m] = usages[key].moves.get(m, 0) + 1
        for u in usages.values():
            u.usage = u.count / len(self.data)
            u.sort()
        return OrderedDict(sorted(usages.items(), key=lambda x: x[1].usage, reverse=True))


async def main():
    rk9_roster_pages = {
        #"orlando": 'https://www.rk9.gg/roster/h7kIYruNMePQMy4UZkMj',
        #"liverpool": 'https://www.rk9.gg/roster/HmWfWFbzLDG5RVOedmuu',
        #"sandiego": 'https://www.rk9.gg/roster/df5AzRjKxTb62H7BsbOe',
        #"ocic": "https://rk9.gg/roster/OCpGIIa9m9BGzlZ8B5Gt",
        #"bochum": "https://rk9.gg/roster/Ut3nbmM0sUXlyQolPRc3",
        #"knoxville": "https://rk9.gg/roster/0pN73b3SizrkohJlZPd6",
        #"perth": "https://rk9.gg/roster/DQ2i9c14imJ8nxdBYtf7",
        #"natal": "https://rk9.gg/roster/NaKAJTF2cJgzF5UfyiO0",
        #"vancouver": "https://rk9.gg/roster/8HIYbbqbaWZ1dpj9uQG3",
        #"utrecht": "https://rk9.gg/roster/iq8HkJq9v11G7GoAOsT0",
        #"charlotte": "https://rk9.gg/roster/DW2KvfN94weVjRBvGcNI",
        "sydney": "https://rk9.gg/roster/u625dn51S2yIWqXPXDJL",
        "fortwayne": "https://rk9.gg/roster/FW22ZFxaHumKzmfUItVF",
    }
    await scrape(rk9_roster_pages)
    for name in rk9_roster_pages.keys():
        filename = name_to_filename(name)
        with open(filename, 'r', encoding='utf-8') as f:
            team_list = json.load(f)
        replace_name_with_showdown_compatible(team_list)
        team_list = add_pokepaste(team_list)
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(team_list, f, indent=2)

if __name__ == '__main__':
    asyncio.get_event_loop().run_until_complete(main())
