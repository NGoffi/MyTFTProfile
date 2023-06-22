//API call working with button click taking input field from summoner name
//Formatting data from response and displaying on frontend
//Use bootstrap to make it look better

const searchInput = document.querySelector("[data-search]");
const butInput = document.querySelector("[summoning]");
const api_key = 'api_key=' + '';
const section = document.querySelector("section");
const myArticle = document.createElement("header");
const myh2 = document.createElement("h2");
//will match with the value in searchbar on click
var searching = "";

// listens for search input from user 
butInput.addEventListener("click", searchbar);


const container = document.createElement("div");
container.setAttribute("class","container");
section.appendChild(container);


function searchbar() {
    // takes the name input currently in the search bar and passes it to summonerinfo
    const value = document.getElementById('search').value
    if (searching != value) {
        searching = value;
        summonerinfo(searching);
    }
}

async function summonerinfo(value) {
    //finds info using riot api and the provided summoner name

    const link = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${value}?${api_key}`;
    const response_SN = await fetch(link);
    let SN = await response_SN.json();
    console.log(SN)

    // creates link to a player's match history, returns json array with last 20 games played
    const get_match_id = `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${SN.puuid}/ids?${api_key}`;
    const response_MID = await fetch(get_match_id);
    let MID = await response_MID.json();
    console.log(MID)
    
    const rank = await take_sid_return_rank(SN.id);
    
    var n = 0;
    
    // n = m-1 where m is the number of matches you would like to pull, do to rate limits I suggest not exceeding 3.
    while (n < 1) {
        const get_match_data = `https://americas.api.riotgames.com/tft/match/v1/matches/${MID[n]}?${api_key}`;
        const response_M = await fetch(get_match_data);
        let M = await response_M.json();
        console.log(M)

        list_players(M)
        
        n++
    }

    //appends info using the given div id and displays the users info for tft
    //update icon_images with correct patch when patches are applied to league of legends
    const icon_images = `https://ddragon.leagueoflegends.com/cdn/13.9.1/img/profileicon/${SN.profileIconId}.png`

    document.getElementById('summonerInfo').innerHTML = '<br><div class="card" style="width: 18rem;"><img src='+ icon_images + ' class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title"> '+ SN.name + '</h5><p class="card-text"> '+ rank +'</p></div>';
}


// counts each match for unique ids in html
var mCount = 0;

async function list_players(obj) {
    // lists players in a given game
    //const section = document.querySelector("section");
    var x = 1;
    mCount++;
    const users = obj.info.participants;

    // button used for individual match info
    const collapsible = document.createElement("button");
    set_Collapsible(collapsible);

    // hold the match data, triggered with assigned collapsible button
    const cTrigger = document.createElement("div");
    cTrigger.setAttribute('class','collapse');
    cTrigger.setAttribute('id',`${mCount}collapseExample`);

    container.appendChild(collapsible);
    container.appendChild(cTrigger);
    //const content= document.createElement("div");
    //content.classList.add('content');
    //collapsible.appendChild(content)

    const list_l = document.createElement("ul");
    list_l.classList.add('list-group');
    list_l.style.width = "100%";
    list_l.style.marginRight = '10%';
    list_l.style.marginLeft = '';
    cTrigger.appendChild(list_l);

    while (x != 9) {
        for (const user of users) {
            if (user.placement == x) {
                x++
        
                const list_item = document.createElement("li");
                list_item.style = "border-radius:8px; border: 5px solid #000;margin:0px";
                list_l.appendChild(list_item);
        
                // put grid code here
                
                // creates a grid 
                const grid = document.createElement("div");
                grid.setAttribute('class','grid');
                list_item.appendChild(grid);
        
                // creates a grid element
                const grid_element_player_info = document.createElement("div");
                grid_element_player_info.setAttribute('class','grid-item');
                grid.appendChild(grid_element_player_info );
        
                const grid_element_traits = document.createElement("div");
                grid_element_traits.setAttribute('class','grid-item');
                grid.appendChild(grid_element_traits);
                grid_element_traits.style.position = "relative";
                grid_element_traits.float = "left";
                
        
                const grid_element_champions_items = document.createElement("div");
                grid_element_champions_items.setAttribute('class','grid-item');
                grid.appendChild(grid_element_champions_items );
                grid_element_champions_items.style.position = "relative";
                grid_element_champions_items.float = "left";
        
                const username= await take_pid_return_name(user.puuid,x);
                const level= player_level(user.level);
                const summonerid = await take_pid_return_sid(user.puuid);
                const lp = await take_sid_return_rank(summonerid);
        
                // for direct player text info displayed in match, for css style
                const header = document.createElement("h2");
                const plp = document.createElement("p")
                plp.setAttribute('class','player-info');
                const pl= document.createElement("p");
                pl.setAttribute('class','player-info');
                const pp = document.createElement("p");
                pp.setAttribute('class','player-info');

                header.textContent = username;

                pl.textContent = level;

                pp.textContent = "placement: " + user.placement;

                plp.textContent = lp;
            
                document.getElementById('summonerInfo').innerHTML
        
                grid_element_player_info.appendChild(header);
        
                grid_element_player_info.appendChild(pp);
            
                grid_element_player_info.appendChild(pl);
        
                grid_element_player_info.appendChild(plp);
        
                find_legend(user.companion.content_ID,grid_element_player_info);
        
                traits_image(user.traits, grid_element_traits);
                player_board(user.units, grid_element_champions_items);
            }
        }
    }
    await tool_Tip();
}

function player_level(obj) {
    // finds player level in given game with the participants data
    return("Level: " + obj);
}

function player_board(obj, grid_CI) {
    // finds players board compisition in given game with the participants data
    var s = "";
    for (const unit of obj) {
        const full_champ = document.createElement("div")
        full_champ.style.width = "50px";
        full_champ.style.height = "50px";
        full_champ.style.margin = "0px";
        full_champ.style.position = "relative";
        full_champ.style.float = "left";
        grid_CI.appendChild(full_champ);
        grid_CI.style.position = "relative";
        grid_CI.style.float = "left";
        var x = 0;
        var equips = "" 
        champion_image(unit.character_id,unit.rarity,full_champ);
        while(x <3) {
            if (unit.itemNames[x] != undefined) {
                equips += unit.itemNames[x];
                item_image(unit.itemNames[x],full_champ,x);
            }
            x++;
        }
    }
}

function traits_image(name,grid_layout) {
    //creates a image of a trait in html within the given header
    for (const trait of name) {
        if (trait.tier_current != 0) {
            var traitname = trait.name.replace(/[A-Z&]/g, m => m === "&" ? "-and-" : m.toLowerCase());
            traitname = traitname.replace('set8_','');
            const myImage = new Image(25,25);
            myImage.src = `https://cdn.metatft.com/file/metatft/traits/${traitname}.png`;

            // can use css to put frame around image later
            if (trait.tier_current == 1) {
                myImage.style = "background-color:brown; border-radius:8px; border: 2px solid #000;margin:4px";
            }
            if (trait.tier_current == 2) {
                myImage.style = "background-color:silver; border-radius:8px; border: 2px solid #000;margin:4px";
            }
            if (trait.tier_current == 3) {
                myImage.style = "background-color:gold; border-radius:8px; border: 2px solid #000;margin:4px";
            }
            if (trait.tier_current == 4) {
                myImage.style = "background-image: linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet); border-radius:8px; border: 2px solid #000;margin:4px";
            }
            myImage.style.position = "relative";
            myImage.style.float = "left";
            myImage.setAttribute('data-bs-toggle','tooltip');
            myImage.setAttribute('data-bs-placement','top');
            myImage.setAttribute('data-bs-custom-class','custom-tooltip');
            myImage.setAttribute('data-bs-title',`${traitname}`);
            grid_layout.appendChild(myImage);
            grid_layout.style.position = "relative";
            grid_layout.style.float = "left";
            }
    }
}

function champion_image(name,cost,champ) {
    // creates a image of a champion in html within the given header
    
    name = name.replace(/[A-Z&]/g, m => m === "&" ? "-and-" : m.toLowerCase());
    const myImage = new Image(40,40);
    myImage.src = `https://cdn.metatft.com/file/metatft/champions/${name}.png`;
    
    
    if (cost == 0) {
        myImage.style = "border-radius:8px; border: 2px solid #808080;margin:3px";
    }
    if (cost == 1) {
        myImage.style = "border-radius:8px; border: 2px solid #30D5C8;margin:3px";
    }
    if (cost== 2) {
        myImage.style = "border-radius:8px; border: 2px solid #4db2ec;margin:3px";
    }
    if (cost == 4 || cost == 9) {
        myImage.style = "border-radius:8px; border: 2px solid #AA336A;margin:3px";
    }
    if (cost == 6) {
        myImage.style = "border-radius:8px; border: 2px solid #FFD700;margin:3px";
    }

    myImage.style.position = "relative";
    myImage.style.float = "left";
    myImage.setAttribute('data-bs-toggle','tooltip');
    myImage.setAttribute('data-bs-placement','top');
    myImage.setAttribute('data-bs-custom-class','custom-tooltip');
    name = name.replace('tft8_','');
    myImage.setAttribute('data-bs-title',`${name}`);
    champ.appendChild(myImage);
    champ.style.position = "relative";
    champ.style.float = "left";
}

function item_image(name,champ,x) {
        // creates a image of an item in html within the given header
    name = name.replace(/[A-Z&]/g, m => m === "&" ? "-and-" : m.toLowerCase());
    const myImage = new Image(13,13);
    //myImage.
    myImage.src = `https://cdn.metatft.com/file/metatft/items/${name}.png`;
    myImage.style = "border: 1px solid #B2BEB5;margin:0px";
    myImage.style.position = "absolute";
    myImage.style.bottom = "5px";
    myImage.style.left = `${(4.5)+x*12}px`;
    myImage.setAttribute('data-bs-toggle','tooltip');
    myImage.setAttribute('data-bs-placement','top');
    myImage.setAttribute('data-bs-custom-class','custom-tooltip');
    name = name.replace('tft_item_','');
    myImage.setAttribute('data-bs-title',`${name}`);
    champ.appendChild(myImage)
}

async function take_pid_return_name(obj,x) {
    // finds player names using pid
    const link = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${obj}?${api_key}`;
    const response_SN = await fetch(link);
    let SN = await response_SN.json();
    return (SN.name);

}

async function take_pid_return_sid(obj) {
    // finds player summoner id using pid
    const link = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${obj}?${api_key}`;
    const response_SN = await fetch(link);
    let SN = await response_SN.json();
    return (SN.id);

}

async function take_sid_return_rank(obj) {
    // finds player summonerid  using pid
    const link = `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${obj}?${api_key}`;
    const response_SN = await fetch(link);
    let SN = await response_SN.json();
    for (var i = 0; i < SN.length; i++) {
        if (SN[i].queueType == "RANKED_TFT") {
            return (SN[i].tier + " " + SN[i].leaguePoints + " lp");
        }
    }
    return "not ranked";

}
function find_legend(ID,player_grid) {
    // finds a given users little legend image given the little legend ID, then appends to the grid in the player section
    const myImage = new Image(50,50);
    myImage.src =`https://ap.tft.tools/img/ll-icons/${ID}.png?w=68`;;
    myImage.style = "margin:20px border: 4px solid #000";
    player_grid.appendChild(myImage)
}

function set_Collapsible(collapsible) {
    // creates a collapsible button for a specific match
    collapsible.setAttribute('class','btn btn-primary');
    collapsible.setAttribute('role','button');
    collapsible.setAttribute('data-bs-toggle','collapse');
    collapsible.setAttribute('data-bs-target',`#${mCount}collapseExample`);
    collapsible.setAttribute('aria-expanded','false');
    collapsible.setAttribute('aria-controls',`${mCount}collapseExample`);
    collapsible.textContent =`Match ${mCount}`
    collapsible.style ="background-color:green; border-radius:8px; border: 2px solid #000;margin:4px";
    //collapsible.style.width = "75%";
}

function buttonClick1() {
    //var sumName = document.getElementById("inputId").value

    fetch('https://raw.communitydragon.org/latest/cdragon/tft/en_us.json')
    .then( response => {
        return console.log(response.json());
    });

}

async function buttonClick2() {
    //var sumName = document.getElementById("inputId").value
    const requestURL = "https://raw.communitydragon.org/latest/cdragon/tft/en_us.json";
    const request = new Request(requestURL);

    const response = await fetch(request);
    const Setinfo = await response.json();

   //populateHeader(Setinfo)
   // sortitems(Setinfo);
    sortchampions(Setinfo);
}

function populateHeader(obj) {
    // creates headings
    const header = document.querySelector("header");
    const myH1 = document.createElement("h1");
    myH1.textContent = (obj.sets);
    header.appendChild(myH1);
}

function sortitems(obj) {
    // lists items using the returned json file
    const section = document.querySelector("section");
    const equipment = obj.items;
    for (const e of equipment) {
        const myArticle = document.createElement("header");
        const myh2 = document.createElement("h2");
        myh2.textContent = e.name;
        myArticle.appendChild(myh2);
        section.appendChild(myArticle);
    }
}

function sortchampions(obj) {
    // lists items using the returned json file
    const section = document.querySelector("section");
    const sets = obj.setData;
    for (const set of sets) {
        const champ = set.champions;
        for (const c of champ) {
            const myArticle = document.createElement("header");
            const myh2 = document.createElement("h2");
            myh2.textContent = c.name;
            myArticle.appendChild(myh2);
            section.appendChild(myArticle);
        }
    }
}

async function tool_Tip() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}

function About() {
    //shows the about page information
    const element1 = document.getElementById("interface-container");
    const element2 = document.getElementById("section1");
    element1.remove();
    element2.remove();
    const about_info = document.createElement("p");
    section_2 = document.getElementById("section2");
    section_2.setAttribute('class','about-info');
    about_info.textContent ="Hello, welcome to my WIP website. Currently the main use of this site is to display my stats and previous games played. In the near future I hope to be able to showcase each players endgame board, allowing players to see each champions individual stats with items equiped etc. I will continue updating once set 9 releases. I believe this will be around mid June. The reason for this is some of the formatting and information will become obsolete and need changes at that point";
    section_2.appendChild(about_info);

}

function Home() {
    //shows the home page information
    location.reload();
}
