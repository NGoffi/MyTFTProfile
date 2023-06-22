// contains the main part of my TFT calc project

// this link contains the tft json file from the most recent patch
const requestURL = "https://raw.communitydragon.org/latest/cdragon/tft/en_us.json";
const request = new Request(requestURL);
const response = await fetch(request);
const Setinfo = await response.json();


var ad = 0; //attack damage
var ap = 0;	 // ability power
var pdr = 0; // physical damage reduction
var mdr = 0; // magical damage reduction	
var aps = 0; // attacks per second	
var hp = 0;	// health (points)
var smp = 0; // starting mana pool
var csc = 0; // critical strike chance