// ==UserScript==
// @name         JKLM BombParty AutoPlayer 💣
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Automatically plays BombParty on JKLM.fun - finds and types the shortest word instantly!
// @author       WordHelper
// @match        https://jklm.fun/*
// @match        https://*.jklm.fun/*
// @match        https://falcon.jklm.fun/*
// @match        https://koala.jklm.fun/*
// @match        https://otter.jklm.fun/*
// @match        https://shark.jklm.fun/*
// @grant        none
// @run-at       document-start
// @noframes     false
// ==/UserScript==

(function() {
    'use strict';

    // Only run in the game iframe (not the parent page)
    const isGameFrame = window.location.href.includes('/games/bombparty') || 
                        document.querySelector('.round') !== null ||
                        window.location.hostname.includes('falcon') ||
                        window.location.hostname.includes('koala') ||
                        window.location.hostname.includes('otter') ||
                        window.location.hostname.includes('shark');
    
    // For parent page - just show a notification
    if (window.location.hostname === 'jklm.fun' && !window.location.pathname.includes('/games/')) {
        console.log('[JKLM Bot] Running on parent page - waiting for game iframe...');
        return; // The script will also run in the iframe
    }

    console.log('[JKLM Bot v3.0] Starting on:', window.location.href);

    // ========== CONFIGURATION ==========
    const CONFIG = {
        enabled: true,
        minDelay: 80,
        maxDelay: 250,
        typeDelay: 15,
        showOverlay: true,
        debugMode: true
    };

    // ========== WORD DICTIONARY ==========
    const WORDS = [
        // 2-3 letter words
        "ab","ad","ae","ah","ai","al","am","an","ar","as","at","aw","ax","ay","ba","be","bi","bo","by",
        "da","de","do","ed","ef","eh","el","em","en","er","es","et","ex","fa","go","ha","he","hi","hm",
        "ho","id","if","in","is","it","jo","ka","ki","la","li","lo","ma","me","mi","mm","mo","mu","my",
        "na","ne","no","nu","od","oe","of","oh","oi","ok","om","on","op","or","os","ou","ow","ox","oy",
        "pa","pe","pi","po","qi","re","sh","si","so","ta","ti","to","uh","um","un","up","us","ut","we",
        "wo","xi","xu","ya","ye","yo","za",
        "ace","act","add","ado","ads","aft","age","ago","aid","aim","air","ale","all","amp","and","ant",
        "any","ape","apt","arc","are","ark","arm","art","ash","ask","ate","awe","awl","axe","aye",
        "bad","bag","ban","bar","bat","bay","bed","bee","beg","bet","bib","bid","big","bin","bit","boa",
        "bob","bod","bog","boo","bop","bot","bow","box","boy","bra","bud","bug","bum","bun","bus","but",
        "buy","bye","cab","cad","cam","can","cap","car","cat","caw","chi","cob","cod","cog","cop","cot",
        "cow","coy","cry","cub","cud","cue","cup","cur","cut","dab","dad","dam","day","den","dew","did",
        "die","dig","dim","din","dip","doc","doe","dog","don","dot","dry","dub","dud","due","dug","duh",
        "dun","duo","dye","ear","eat","eel","egg","ego","elf","elk","elm","emu","end","eon","era","err",
        "eve","ewe","eye","fab","fad","fan","far","fat","fax","fed","fee","fen","few","fib","fig","fin",
        "fir","fit","fix","flu","fly","fob","foe","fog","fop","for","fox","fry","fun","fur","gab","gag",
        "gal","gap","gas","gay","gee","gel","gem","get","gig","gin","gnu","gob","god","got","gum","gun",
        "gut","guy","gym","had","hag","ham","has","hat","hay","hem","hen","her","hew","hex","hid","him",
        "hip","his","hit","hob","hod","hoe","hog","hop","hot","how","hub","hue","hug","hum","hut","ice",
        "icy","ids","iff","ilk","ill","imp","ink","inn","ins","ion","ire","irk","ism","its","ivy","jab",
        "jag","jam","jar","jaw","jay","jet","jib","jig","job","jog","jot","joy","jug","jut","keg","ken",
        "key","kid","kin","kit","lab","lac","lad","lag","lap","law","lax","lay","lea","led","leg","let",
        "lib","lid","lie","lip","lit","lob","log","loo","lop","lot","low","lox","lug","mad","man","map",
        "mar","mat","maw","may","men","met","mew","mid","mix","mob","mod","mom","moo","mop","mow","mud",
        "mug","mum","nab","nag","nan","nap","nay","net","new","nib","nil","nip","nit","nix","nob","nod",
        "nog","nor","not","now","nub","nun","nut","oak","oar","oat","odd","ode","off","oft","ohm","oho",
        "ohs","oil","old","ole","one","ooh","ops","opt","orb","orc","ore","our","out","ova","owe","owl",
        "own","pad","pal","pan","pap","par","pas","pat","paw","pay","pea","pee","peg","pen","pep","per",
        "pet","pew","phi","pic","pie","pig","pin","pip","pis","pit","ply","pod","poi","pol","pom","pop",
        "pot","pow","pox","pro","pry","psi","pub","pug","pun","pup","pus","put","qua","quo","rad","rag",
        "raj","ram","ran","rap","rat","raw","ray","red","ref","rem","rep","rev","rex","rib","rid","rif",
        "rig","rim","rip","rob","roc","rod","roe","rom","rot","row","rub","rue","rug","rum","run","rut",
        "rye","sac","sad","sag","sap","sat","saw","sax","say","sea","sec","set","sew","sex","she","shh",
        "shy","sic","sim","sin","sip","sir","sis","sit","six","ska","ski","sky","sly","sob","sod","sol",
        "som","son","sop","sos","sot","sow","sox","soy","spa","spy","sty","sub","sue","sum","sun","sup",
        "tab","tad","tag","tan","tao","tap","tar","tat","tax","tea","tee","ten","the","thy","tic","tie",
        "tin","tip","tit","tod","toe","tog","tom","ton","too","top","tor","tot","tow","toy","try","tsk",
        "tub","tug","tum","tun","tut","tux","two","ugh","uke","umm","ump","uni","uns","upo","ups","urb",
        "urn","use","uta","uts","van","vat","vet","vex","via","vid","vie","vim","vow","wad","wag","wan",
        "war","was","wax","way","web","wed","wee","wet","who","why","wig","win","wit","wiz","woe","wok",
        "won","woo","wop","wow","wry","yak","yam","yap","yaw","yay","yea","yeh","yen","yep","yes","yet",
        "yew","yin","yip","yob","yod","yok","yom","yon","you","yow","yuk","yum","yup","zag","zap","zed",
        "zee","zen","zig","zin","zip","zit","zoa","zoo",
        // 4 letter words
        "aahs","aals","abas","abet","able","ably","abut","aces","ache","achy","acid","acme","acne","acre",
        "acts","adds","aeon","aero","aery","afar","agar","aged","agee","ager","ages","agio","agog","ague",
        "ahem","aide","aids","ails","aims","ains","airn","airs","airt","airy","aits","ajar","ajis","akin",
        "alae","alan","alar","alas","albs","alee","ales","alfs","ally","alma","alms","aloe","alow","alps",
        "also","alto","alts","alum","amah","amas","ambo","amen","amia","amid","amie","amin","amir","amis",
        "ammo","amok","amps","amus","anal","anas","ands","anes","anew","anga","anil","anis","ankh","anna",
        "anno","anoa","anon","ansa","anta","ante","anti","ants","anus","aped","aper","apes","apex","aqua",
        "arab","arbs","arch","arco","arcs","area","ares","aria","arid","aril","arks","arms","army","arts",
        "arty","arum","arvo","aryl","asci","asea","ashy","asks","asps","atap","ates","atma","atom","atop",
        "aunt","aura","auto","avar","avel","aver","aves","avid","avos","avow","away","awed","awee","awes",
        "awls","awns","awny","awol","awry","axal","axed","axel","axes","axil","axis","axle","axon","ayah",
        "ayes","ayin","azan","azon","baal","baas","babe","baby","bach","back","bade","bads","baff","bags",
        "baht","bail","bait","bake","bald","bale","balk","ball","balm","bals","bams","banc","band","bane",
        "bang","bani","bank","bans","baps","barb","bard","bare","barf","bark","barm","barn","bars","base",
        "bash","bask","bass","bast","bate","bath","bats","batt","baud","bawl","bawn","baws","bays","bead",
        "beak","beam","bean","bear","beat","beau","beck","beds","beef","been","beep","beer","bees","beet",
        "begs","bell","belt","bema","bend","bene","bent","berg","berk","berm","best","beta","beth","bets",
        "bevy","beys","bias","bibb","bibs","bice","bide","bids","bier","biff","bigs","bike","bile","bilk",
        "bill","bind","bine","bing","bins","bint","bios","bird","birk","birl","birr","bise","bisk","bite",
        "bits","bitt","bize","blab","blae","blah","blam","blat","blaw","bled","blet","blew","blin","blip",
        "blob","bloc","blog","blot","blow","blue","blur","boar","boas","boat","bobs","bock","bode","bods",
        "body","boff","bogs","bogy","boho","boil","bola","bold","bole","boll","bolo","bolt","bomb","bond",
        "bone","bong","bonk","bony","boob","book","boom","boon","boor","boos","boot","bops","bora","bore",
        "born","bort","bosh","bosk","boss","both","bots","bout","bowl","bows","boxy","boyo","boys","bozo",
        "brad","brae","brag","bran","bras","brat","braw","bray","bred","bree","bren","brew","brie","brig",
        "brim","brin","brio","brit","bro","bros","brow","brut","bubo","bubs","buck","buds","buff","bugs",
        "bulb","bulk","bull","bumf","bump","bums","bund","bung","bunk","buns","bunt","buoy","bura","burd",
        "burg","burk","burl","burn","burp","burr","burs","bury","bush","busk","buss","bust","busy","buts",
        "butt","buys","buzz","byes","byre","byte","cabs","cade","cadi","cads","cafe","caff","cage","cagy",
        "caid","cain","cake","caky","calf","calk","call","calm","calo","calx","came","cami","camo","camp",
        "cams","cane","cans","cape","capo","caps","card","care","cark","carl","carn","carp","cars","cart",
        "casa","case","cash","cask","cast","cate","cats","caul","cave","cavy","caws","cays","ceas","ceca",
        "cede","cedi","cees","ceil","cell","cels","celt","cens","cent","cepe","ceps","cere","cero","cert",
        "cess","chad","chai","cham","chao","chap","char","chat","chaw","chef","chem","chew","chez","chia",
        "chic","chid","chin","chip","chis","chit","chiv","chon","chop","chow","chub","chug","chum","ciao",
        "cigs","cine","cion","cire","cirl","cist","cite","city","clad","clag","clam","clan","clap","claw",
        "clay","cled","clee","cleg","clef","clew","clip","clod","clog","clon","clop","clot","clou","clow",
        "cloy","club","clue","coal","coat","coax","cobb","cobs","coca","cock","coco","coda","code","cods",
        "coed","coff","coft","cogs","coho","coif","coil","coin","coir","coke","coky","cola","cold","cole",
        "cols","colt","coly","coma","comb","come","comp","cone","coni","conk","conn","cons","cony","cook",
        "cool","coom","coon","coop","coos","coot","cope","cops","copy","cord","core","corf","cork","corm",
        "corn","cors","cory","cosh","coss","cost","cosy","cote","cots","coup","cove","cowl","cows","cowy",
        "coxa","coys","cozy","crab","crag","cram","craw","cray","cred","cree","crew","crib","crim","cris",
        "crit","croc","crog","crop","crow","crud","crus","crux","cube","cubs","cuds","cued","cues","cuff",
        "cuif","cuke","cull","culm","cult","cums","cunt","cups","curb","curd","cure","curl","curn","curr",
        "curs","curt","cusk","cusp","cuss","cute","cuts","cwms","cyan","cyst","czar",
        // 5 letter words
        "abaca","aback","abaft","abase","abash","abate","abbey","abbot","abele","abets","abhor","abide",
        "abler","abode","abort","about","above","abuse","abuts","abysm","abyss","acari","acerb","ached",
        "aches","achoo","acids","acidy","acing","ackee","acmes","acned","acnes","acock","acold","acorn",
        "acres","acrid","acted","actin","actor","acute","adage","adapt","addax","added","adder","addle",
        "adeem","adept","adieu","adios","adits","adman","admin","admit","admix","adobe","adopt","adore",
        "adorn","adult","adust","adyta","aecia","aegis","aeons","aerie","affix","afire","afoot","afore",
        "after","again","agama","agars","agate","agave","agaze","agene","agent","agers","agger","aggie",
        "aggro","aghas","agile","aging","agios","agism","agist","aglet","agley","aglow","agone","agons",
        "agony","agora","agree","agues","ahead","ahing","ahold","aided","aider","aides","aiery","ailed",
        "aimed","aimer","aioli","aired","airer","airth","airts","aisle","aitch","aiver","ajiva","ajuga",
        "akees","akela","akene","alack","alamo","aland","alane","alans","alant","alarm","alary","alate",
        "albas","album","alcid","alder","aldol","alecs","alefs","aleph","alert","alfas","algae","algal",
        "algas","algid","algin","algor","algum","alias","alibi","alien","align","alike","aline","alist",
        "alive","aliya","alkyd","alkyl","allay","allee","alley","allod","allot","allow","alloy","allyl",
        "almah","almas","almeh","almes","almos","almud","aloft","aloha","alone","along","aloof","aloud",
        "alpha","altar","alter","altho","altos","alula","alums","alvar","alway","amahs","amain","amass",
        "amaze","amber","ambit","amble","ambos","ambry","ameba","ameer","amend","amens","ament","amias",
        "amice","amide","amids","amies","amiga","amigo","amine","amino","amins","amirs","amiss","amity",
        "ammos","amnio","amnia","amnic","amoks","among","amort","amour","amped","ample","amply","ampul",
        "amuck","amuse","amyls","ancon","anger","angle","angry","angst","anile","anime","anion","anise",
        "ankhs","ankle","annas","annex","annoy","annul","anoas","anode","anole","antsy","anvil","aorta",
        "apace","apart","apeak","aphid","aphis","apian","aping","apish","apnea","aport","apple","apply",
        "appro","apron","apses","apter","aptly","aquas","arach","arame","arbor","arced","archi","arcus",
        "ardor","areal","areas","areca","arena","arete","argal","argil","argle","argon","argot","argue",
        "argus","arhat","arias","ariel","arils","arise","arles","armed","armer","armor","aroid","aroma",
        "arose","arpen","arras","array","arris","arrow","arsed","arses","arsis","arson","artal","artel",
        "artsy","arums","arval","arvel","asana","ascii","ascot","ascus","asdic","ashed","ashen","ashes",
        "aside","asked","asker","askew","askoi","aspen","asper","aspic","aspis","assay","assed","asses",
        "asset","ataps","ataxy","atilt","atlas","atman","atmas","atoll","atoms","atomy","atone","atony",
        "atopy","atria","atrip","attar","attic","audad","audio","audit","auger","aught","augur","aunts",
        "aunty","aurae","aural","aurar","auras","aurei","aures","auric","auris","aurum","autos","auyls",
        "avail","avant","avast","avens","avers","avert","avgas","avian","avion","aviso","avoid","avows",
        "await","awake","award","aware","awash","awful","awing","awned","awoke","awols","axels","axial",
        "axile","axils","axing","axiom","axion","axite","axled","axles","axman","axone","axons","ayahs",
        "azans","azide","azine","azole","azons","azoic","azure",
        // Common 6+ letter words
        "baboon","backup","badge","badger","badly","baffle","bagel","baker","bakery","balance","balcony",
        "bamboo","banana","bandit","banker","banner","barber","barely","bargain","barrel","barrier","basket",
        "battle","beacon","beauty","became","become","before","began","begin","begun","behalf","behave","behind",
        "behold","belief","believe","belong","below","beneath","benefit","beside","besides","better","between",
        "beyond","bicycle","bigger","billion","binary","bishop","bitter","blanket","blazer","blender","blessed",
        "blister","blossom","blouse","blueprint","blunder","boaster","bodily","bonfire","bonnet","booklet","border",
        "boredom","borrow","botany","bother","bottle","bottom","boulder","bounce","bounty","boxing","bracket",
        "branch","breach","breath","breeze","bridge","bridle","bright","brilliant","brings","british","broken",
        "broker","bronze","brother","browse","browser","bruise","bubble","bucket","buckle","budget","buffet",
        "builder","building","bullet","bumper","bundle","bunker","burden","burger","burial","button","buying",
        "bypass","cabinet","cactus","cajole","calcium","calendar","campus","canary","cancel","cancer","candid",
        "candle","cannon","cannot","canvas","canyon","capable","capital","capsule","captain","caption","capture",
        "carbon","career","careful","carpet","carrier","carrot","castle","casual","catalog","cattle","caught",
        "caution","ceiling","cellar","cement","center","central","century","ceramic","cereal","certain","chamber",
        "champion","chance","change","channel","chapter","charge","charity","charter","cheap","cheese","cherry",
        "chicken","chief","child","children","chimney","choice","cholera","choose","chosen","chrome","chunk",
        "church","cipher","circle","circuit","citizen","citrus","claimed","classic","clause","cleaner","clearly",
        "clergy","clever","client","climate","climax","clinic","clique","closet","clothes","cluster","coastal",
        "cobalt","cobweb","cockpit","cocktail","cocoon","coffee","coffin","cognac","coherent","coldest","collar",
        "college","colony","column","combat","combine","comedy","comfort","coming","command","comment","commerce",
        "commit","common","compact","company","compare","compass","compel","compete","compile","complex","comply",
        "compose","compound","compute","concept","concern","concert","conclude","concrete","condemn","conduct",
        "confer","confess","confine","confirm","conflict","conform","confuse","congress","connect","conquer",
        "consent","consider","consist","console","consort","constant","consul","consult","consume","contact",
        "contain","content","contest","context","continue","contract","contrast","contribute","control","convey",
        "convict","convince","copper","corner","correct","corrupt","cosmic","costly","cotton","council","counsel",
        "counter","country","county","couple","coupon","courage","course","cousin","coverage","coward","cowboy",
        "coyote","cradle","crafty","cranny","crater","crawly","crayon","create","credit","creepy","crisis",
        "crispy","critic","crocus","croquet","crowd","crown","crucial","cruise","crumby","crunch","crusty",
        "crystal","cuddle","culture","cunning","cupboard","curious","current","curtain","custom","customer",
        "cylinder","cymbal","cypress","daffodil","damage","dampen","dancer","danger","dangle","dapper","darkly",
        "dating","daughter","dazzle","deadly","dealer","dearly","debate","debris","decade","decent","decide",
        "decimal","declare","decline","decode","decree","deduce","deepen","deeply","defeat","defect","defend",
        "define","degree","delete","delight","deliver","demand","demise","denial","denote","dental","depend",
        "depict","deploy","deposit","deputy","derive","descend","describe","desert","deserve","design","desire",
        "despair","dessert","destroy","detail","detect","determine","develop","device","devise","devote","devour",
        "diagram","dialect","diamond","diaper","dictate","diesel","differ","digest","digital","dignity","dilute",
        "dimmer","dinner","diploma","direct","disagree","disappear","disaster","discard","discharge","disciple",
        "discipline","disclose","discount","discover","discuss","disease","disgrace","disguise","disgust","dishonest",
        "dislike","dismiss","disorder","dispatch","display","dispose","dispute","disrupt","dissolve","distance",
        "distant","distinct","distort","distract","distribute","district","disturb","diverse","divide","divine",
        "divorce","doctor","document","dollar","dolphin","domain","domestic","dominant","dominate","donate",
        "donkey","double","doubtful","doughnut","download","downtown","dragon","drainage","dramatic","drapery",
        "drawback","drawing","dreadful","dreamer","dressing","dribble","driller","drinking","driver","droplet",
        "drought","drummer","drunken","duchess","durable","during","dustpan","dwelling","dynamic","dynasty",
        "eagerly","earlier","earnest","earning","eastern","eclipse","ecology","economy","edition","editor",
        "educate","effect","effective","effort","eighteen","eighth","elastic","elbow","elderly","elect","electric",
        "electron","elegant","element","elephant","elevate","elevator","eleven","eligible","eliminate","elite",
        "eloquent","elsewhere","embark","embassy","embrace","emerge","emergency","emigrate","emission","emotion",
        "emperor","emphasis","emphasize","empire","employ","employee","employer","empower","empress","empty",
        "enable","enact","enchant","enclose","encode","encounter","encourage","endeavor","endless","endorse",
        "endure","enemy","energize","energy","enforce","engage","engine","engineer","enhance","enjoy","enlarge",
        "enlighten","enormous","enough","enquire","enrich","enroll","ensure","enter","enterprise","entertain",
        "enthusiasm","entire","entirely","entrance","entry","envelope","environment","episode","equal","equally",
        "equator","equip","equipment","equivalent","eraser","errand","error","erupt","escape","escort","especially",
        "espresso","essay","essence","essential","establish","estate","estimate","eternal","ethics","ethnic",
        "evacuate","evaluate","evening","event","eventual","eventually","everybody","everyday","everyone","everything",
        "everywhere","evidence","evident","evolution","evolve","exact","exactly","exaggerate","examine","example",
        "exceed","excellent","except","exception","excess","exchange","excite","excitement","exciting","exclude",
        "exclusive","excuse","execute","executive","exempt","exercise","exhaust","exhibit","exhibition","exist",
        "existence","existing","expand","expect","expedition","expense","expensive","experience","experiment","expert",
        "explain","explanation","explode","exploit","explore","explorer","explosion","export","expose","exposure",
        "express","expression","extend","extension","extensive","extent","external","extra","extract","extraordinary",
        "extreme","extremely","fabric","facial","facility","factor","factory","faculty","failure","fairly","fairy",
        "faithful","fallen","false","fame","familiar","family","famine","famous","fancy","fantasy","faraway",
        "farmer","fashion","fatal","father","fatigue","fatty","fault","fauna","favor","favorite","fearful",
        "feasible","feast","feather","feature","federal","feedback","feeling","fellow","female","feminine","fence",
        "fertile","festival","fetch","fever","fiber","fiction","field","fierce","fifteen","fifth","fifty","fight",
        "fighter","figure","filling","filter","final","finally","finance","financial","finding","finish","finite",
        "firefox","fireplace","firework","fiscal","fisher","fishing","fitness","fitting","fixed","fixture","flag",
        "flame","flashing","flashlight","flask","flatten","flavor","flesh","flexible","flight","flimsy","float",
        "flock","flood","floor","florist","flour","flower","fluent","fluffy","fluid","fluorescent","flurry","flush",
        "flutter","flying","focal","focus","folder","folding","folklore","follow","follower","following","fondly",
        "foolish","footage","football","footprint","forbid","force","forecast","forehead","foreign","foreigner",
        "forest","forever","forge","forget","forgive","fork","formal","format","former","formula","forth","fortune",
        "forward","fossil","foster","foundation","founder","fountain","fourteen","fourth","fraction","fracture",
        "fragment","frame","framework","franchise","frankly","fraud","freedom","freely","freeze","freezer","freight",
        "french","frequency","frequent","fresh","friction","friday","fridge","friend","friendly","friendship",
        "frighten","fright","fringe","frog","frontier","frost","frozen","fruit","frustrate","fulfill","fulfillment",
        "function","fund","fundamental","funeral","fungus","funny","furniture","further","furthermore","future",
        "gadget","galaxy","gallery","gallon","gamble","gambling","gangster","garage","garbage","garden","garlic",
        "garment","gasoline","gateway","gather","gauge","gender","general","generate","generation","generous",
        "genetic","genius","gentle","gentleman","genuine","geography","gesture","ghetto","ghost","giant","gigantic",
        "ginger","girlfriend","glacier","glamour","glance","glimpse","global","globe","glory","glossary","glove",
        "glucose","godfather","golden","gorgeous","gospel","govern","government","governor","grace","graceful",
        "grade","gradual","graduate","grain","grammar","grand","grandchild","grandfather","grandmother","grandparent",
        "granite","grant","grape","graph","graphic","grasp","grass","grateful","grave","gravity","great","greatly",
        "greenhouse","greeting","grill","grocery","gross","ground","group","growth","guarantee","guard","guardian",
        "guess","guest","guidance","guide","guideline","guilty","guitar","gymnasium","habitat","haircut","hairy",
        "halfway","hallway","hamburger","hammer","handful","handicap","handle","handsome","handwriting","handy",
        "happen","happiness","happy","harbor","hardly","hardship","hardware","harmful","harmony","harvest","haste",
        "hasty","hatred","haunt","haven","hazard","heading","headline","headquarters","health","healthy","hearing",
        "heart","hearty","heaven","heavily","heavy","height","helicopter","helpful","hence","heritage","hero",
        "heroic","hesitate","hidden","hierarchy","highway","hiking","himself","hinder","hippie","hiring","historic",
        "historical","history","hockey","holder","holding","holiday","hollow","homeland","homeless","homework",
        "honest","honesty","honey","honor","horizon","horizontal","hormone","horrible","horror","hospital","host",
        "hostile","hostility","hotel","household","housing","however","humanity","humble","humid","humidity",
        "humor","hundred","hungry","hunter","hunting","hurricane","husband","hydrogen","hypothesis","iceberg",
        "identical","identify","identity","ideology","ignorance","ignore","illegal","illness","illustrate","image",
        "imagery","imagination","imagine","imitate","immediate","immediately","immense","immigrant","immigration",
        "immune","impact","implement","implication","imply","import","importance","important","impose","impossible",
        "impress","impression","impressive","improve","improvement","impulse","incentive","incident","include",
        "income","incorporate","increase","incredible","indeed","independence","independent","index","indicate",
        "indication","indicator","indirect","individual","indoor","induce","industrial","industry","inevitable",
        "infant","infection","infinite","inflation","influence","inform","information","ingredient","inhabitant",
        "initial","initially","initiate","initiative","inject","injection","injury","injustice","inner","innocent",
        "innovation","innovative","input","inquiry","insect","insert","inside","insight","insist","inspection",
        "inspector","inspiration","inspire","install","instance","instant","instantly","instead","institute",
        "institution","instruction","instructor","instrument","insurance","integrate","integrity","intellectual",
        "intelligence","intelligent","intend","intense","intensity","intention","interact","interaction","interest",
        "interesting","interior","internal","international","internet","interpret","interpretation","intervention",
        "interview","intimate","introduce","introduction","invade","invasion","invent","invention","invest",
        "investigate","investigation","investment","investor","invisible","invitation","invite","involve","involvement",
        "irregular","island","isolate","issue","itself","jacket","jaguar","january","jealous","jelly","jersey",
        "jewel","jewelry","jewish","jigsaw","journal","journalist","journey","judge","judgment","juice","juicy",
        "jumble","jumbo","junction","jungle","junior","justice","justify","kayak","keeper","kettle","keyboard",
        "kidney","killer","killing","kindly","kingdom","kitchen","knight","knock","knowledge","label","labor",
        "laboratory","ladder","landing","landmark","landscape","language","laptop","largely","laser","lasting",
        "lately","later","latest","latter","launch","laundry","lavender","lawsuit","lawyer","layer","layout",
        "leader","leadership","leading","league","learning","leather","lecture","legacy","legend","legendary",
        "legislation","legitimate","leisure","lemon","lender","lending","length","lesson","letter","level","liberal",
        "liberty","library","license","lifestyle","lifetime","light","lighting","likely","likewise","limb","limit",
        "limitation","limited","linen","liner","linger","linguistic","lining","liquid","liquor","listener","listing",
        "literacy","literary","literature","litter","little","living","lizard","lobby","local","locate","location",
        "locket","lodge","lofty","logic","logical","lonely","longer","lookup","loose","lottery","lounge","lovely",
        "lover","lower","loyal","loyalty","lubricant","lucky","luggage","lumber","lunacy","lunar","lunch","luster",
        "luxury","machine","machinery","madness","magazine","magic","magical","magnet","magnetic","magnificent",
        "magnitude","maiden","mainstream","maintain","maintenance","major","majority","makeup","malady","mammal",
        "manage","management","manager","mandate","mango","manifest","mankind","manner","mansion","manual","manufacture",
        "manufacturer","manuscript","marble","march","margin","marine","marker","market","marketing","marriage",
        "martial","marvelous","massive","master","masterpiece","match","matching","material","mathematical",
        "mathematics","matter","mature","maximum","mayonnaise","meadow","meaning","meaningful","meantime","meanwhile",
        "measure","measurement","mechanic","mechanical","mechanism","medal","medical","medication","medicine",
        "medieval","medium","meeting","melody","member","membership","memorial","memory","mental","mention","mentor",
        "merchant","mercy","merely","merge","merger","merit","message","messenger","metal","metaphor","method",
        "metric","microphone","microscope","microwave","middle","midnight","might","mighty","migrate","military",
        "milk","millennium","miller","million","mimic","mineral","minimal","minimum","mining","minister","ministry",
        "minor","minority","minute","miracle","mirror","misery","mislead","missile","missing","mission","mistake",
        "mixed","mixture","mobile","mobility","model","moderate","modern","modest","modify","module","moisture",
        "molecule","moment","momentum","monarch","monastery","monday","monetary","monitor","monkey","monster",
        "month","monthly","monument","moral","moreover","morning","mortal","mortgage","mostly","mother","motion",
        "motivate","motivation","motor","motorcycle","mount","mountain","mouse","mouth","movement","movie","moving",
        "multiple","multiply","municipal","murder","muscle","museum","mushroom","musical","musician","muslim",
        "mutual","mystery","myth","mythology","namely","narrative","narrow","nasty","nation","national","native",
        "natural","naturally","nature","naval","navigation","nearby","nearly","necessarily","necessary","necessity",
        "needle","negative","negotiate","negotiation","neighbor","neighborhood","neither","nervous","network",
        "neutral","never","nevertheless","newborn","newly","newsletter","newspaper","next","nicely","nightmare",
        "ninety","nitrogen","nobody","noise","nominal","nominate","nonetheless","nonprofit","nonsense","normal",
        "normally","northern","notable","notably","nothing","notice","notify","notion","notorious","novel","novelist",
        "november","nowhere","nuclear","nucleus","number","numerous","nurse","nursery","nursing","nutrient",
        "nutrition","obedient","object","objective","obligation","observation","observe","observer","obstacle",
        "obtain","obvious","obviously","occasion","occasional","occasionally","occupation","occupy","occur","ocean",
        "october","offense","offensive","offer","offering","office","officer","official","offline","offset","often",
        "olive","olympic","ongoing","onion","online","opening","openly","opera","operate","operating","operation",
        "operator","opinion","opponent","opportunity","oppose","opposite","opposition","optical","optimal","optimism",
        "optimistic","option","optional","orange","orbit","orchestra","ordinary","organic","organization","organize",
        "orient","orientation","origin","original","originally","orphan","other","otherwise","outcome","outdoor",
        "outer","outfit","outline","outlook","output","outrage","outside","outstanding","overall","overcome","overlook",
        "overnight","overseas","overwhelm","overwhelming","owner","ownership","oxygen","pacific","package","painful",
        "paint","painter","painting","palace","panel","panic","pants","paper","parade","paragraph","parallel",
        "parameter","parent","parish","parking","parliament","partial","partially","participant","participate",
        "participation","particle","particular","particularly","partly","partner","partnership","passage","passenger",
        "passing","passion","passive","passport","password","patch","patent","path","patience","patient","patrol",
        "patron","pattern","pause","pavement","payment","peace","peaceful","peak","peasant","peculiar","penalty",
        "pencil","pending","pension","people","pepper","perceive","percent","percentage","perception","perfect",
        "perfectly","perform","performance","perhaps","period","permanent","permission","permit","persist","persistent",
        "person","personal","personality","personally","personnel","perspective","persuade","petition","petroleum",
        "phenomenon","philosopher","philosophy","phone","photo","photograph","photographer","photography","phrase",
        "physical","physically","physician","physics","piano","pickup","picture","piece","pilot","pioneer","pipeline",
        "pitch","pizza","place","placement","plain","plaintiff","planet","planning","plant","plastic","plate",
        "platform","player","playground","pleasant","please","pleasure","pledge","plenty","plot","plumber","pocket",
        "poetry","point","poison","polar","police","policy","polish","polite","political","politician","politics",
        "pollution","pool","popular","popularity","population","porch","portrait","portray","position","positive",
        "possess","possession","possibility","possible","possibly","poster","postpone","potato","potential","potentially",
        "pottery","pound","poverty","powder","power","powerful","practical","practice","praise","prayer","precious",
        "precise","precisely","precision","predict","prediction","prefer","preference","pregnancy","pregnant","prejudice",
        "preliminary","premier","premise","premium","preparation","prepare","prescription","presence","present",
        "presentation","preserve","president","presidential","press","pressure","presumably","pretend","pretty",
        "prevail","prevent","prevention","previous","previously","price","pride","priest","primarily","primary",
        "prime","prince","princess","principal","principle","print","printer","printing","prior","priority","prison",
        "prisoner","privacy","private","privilege","prize","probability","probable","probably","problem","procedure",
        "proceed","process","processing","produce","producer","product","production","productive","profession",
        "professional","professor","profile","profit","profitable","program","programmer","progress","progressive",
        "project","prominent","promise","promote","promotion","prompt","proof","proper","properly","property","prophet",
        "proportion","proposal","propose","proposed","prosecutor","prospect","protect","protection","protein","protest",
        "proud","prove","provide","provider","province","provision","psychological","psychology","public","publication",
        "publicity","publicly","publish","publisher","punch","punish","punishment","pupil","purchase","pure","purple",
        "purpose","pursue","pursuit","puzzle","pyramid","qualify","quality","quantity","quarter","quarterly","queen",
        "query","quest","question","questionnaire","quick","quickly","quiet","quietly","quilt","quota","rabbit",
        "racial","racism","radar","radiation","radical","radio","radius","railway","rainbow","raise","rally","ranch",
        "random","range","ranking","rapid","rapidly","rare","rarely","ratio","rational","reach","react","reaction",
        "reader","readily","reading","ready","realistic","reality","realize","really","realm","reason","reasonable",
        "reasonably","rebel","recall","receipt","receive","receiver","recent","recently","reception","recipe","recipient",
        "recognition","recognize","recommend","recommendation","record","recording","recover","recovery","recruit",
        "recruitment","reduce","reduction","refer","reference","reflect","reflection","reform","refuge","refugee",
        "refuse","regard","regarding","regardless","regime","region","regional","register","regular","regularly",
        "regulate","regulation","reinforce","reject","relate","related","relation","relationship","relative","relatively",
        "relax","release","relevant","reliable","relief","relieve","religion","religious","rely","remain","remaining",
        "remains","remark","remarkable","remedy","remember","remind","remote","removal","remove","render","renew",
        "rental","repair","repeat","replace","replacement","reply","report","reporter","represent","representation",
        "representative","republic","republican","reputation","request","require","requirement","rescue","research",
        "researcher","resemble","reservation","reserve","residence","resident","residential","resign","resist",
        "resistance","resolution","resolve","resort","resource","respect","respectively","respond","respondent",
        "response","responsibility","responsible","restaurant","restore","restrict","restriction","result","resume",
        "retail","retain","retire","retirement","retreat","retrieve","return","reveal","revenue","reverse","review",
        "revolution","revolutionary","reward","rhetoric","rhythm","rice","rich","rider","ridge","ridiculous","rifle",
        "right","rigid","ring","rise","rising","risk","ritual","rival","river","robot","robust","rocket","role",
        "roller","roman","romantic","roof","rookie","room","root","rope","rough","roughly","round","route","routine",
        "royal","rubber","rural","sacred","sacrifice","sadly","safety","saint","sake","salad","salary","salmon",
        "salon","sample","sanction","sand","sandwich","satellite","satisfaction","satisfy","saturday","sauce","saving",
        "scale","scandal","scared","scatter","scenario","scene","schedule","scheme","scholar","scholarship","school",
        "science","scientific","scientist","scope","score","scratch","screen","script","sculpture","search","season",
        "seat","second","secondary","secret","secretary","section","sector","secure","security","seek","segment",
        "seize","select","selection","self","seller","selling","senate","senator","senior","sense","sensitive",
        "sentence","separate","separation","september","sequence","series","serious","seriously","servant","serve",
        "server","service","session","setting","settle","settlement","seven","seventh","several","severe","shadow",
        "shake","shall","shallow","shame","shape","share","shareholder","sharp","sheep","sheet","shelf","shell",
        "shelter","shift","shine","ship","shipping","shirt","shock","shoe","shoot","shooting","shop","shopping",
        "shore","short","shortage","shortly","shot","should","shoulder","shout","show","shower","shrink","shut",
        "sibling","sick","side","sight","sign","signal","signature","significance","significant","significantly",
        "silence","silent","silk","silly","silver","similar","similarly","simple","simply","simulate","simulation",
        "simultaneous","since","sincere","singer","single","sink","sister","site","situation","sixth","size","sketch",
        "skill","skilled","skin","slave","sleep","slice","slide","slight","slightly","slip","slope","slow","slowly",
        "small","smart","smell","smile","smoke","smoking","smooth","snap","snow","social","society","soft","software",
        "soil","solar","soldier","sole","solely","solid","solution","solve","somebody","somehow","someone","something",
        "sometimes","somewhat","somewhere","song","soon","sophisticated","sorry","sort","soul","sound","soup","source",
        "south","southern","soviet","space","spare","speak","speaker","special","specialist","species","specific",
        "specifically","specify","spectrum","speech","speed","spell","spelling","spend","spending","sphere","spin",
        "spirit","spiritual","spite","split","spokesman","sponsor","sport","spot","spread","spring","squad","square",
        "squeeze","stability","stable","stadium","staff","stage","stair","stake","stamp","stand","standard","standing",
        "star","stare","start","starting","state","statement","station","statistical","statistics","status","stay",
        "steady","steal","steam","steel","steep","stem","step","stick","still","stimulate","stimulus","stock","stomach",
        "stone","stop","storage","store","storm","story","straight","strain","strange","stranger","strategic","strategy",
        "stream","street","strength","strengthen","stress","stretch","strict","strictly","strike","string","strip",
        "stroke","strong","strongly","structural","structure","struggle","student","studio","study","stuff","stupid",
        "style","subject","submit","subsequent","subsequently","substance","substantial","substantially","subtle",
        "suburb","succeed","success","successful","successfully","such","sudden","suddenly","suffer","sufficient",
        "sugar","suggest","suggestion","suicide","suit","suitable","suite","summer","summit","sunday","super","superior",
        "supply","support","supporter","suppose","supposed","supreme","sure","surely","surface","surgery","surplus",
        "surprise","surprised","surprising","surprisingly","surround","surrounding","survey","survival","survive",
        "survivor","suspect","suspend","sustain","sustainable","swear","sweep","sweet","swim","swimming","swing",
        "switch","symbol","sympathy","symptom","syndrome","system","table","tablet","tackle","tactic","tail","talent",
        "talk","tall","tank","tape","target","task","taste","tax","taxpayer","teach","teacher","teaching","team",
        "tear","technical","technique","technology","teenage","teenager","teeth","telephone","telescope","television",
        "tell","temperature","temple","temporary","tenant","tend","tendency","tender","tennis","tension","tent",
        "term","terminal","terms","terrain","terrible","territory","terror","terrorism","terrorist","test","testify",
        "testimony","testing","text","textbook","texture","thank","thanks","that","theater","theme","themselves",
        "then","theology","theoretical","theory","therapy","there","thereafter","thereby","therefore","these","thick",
        "thin","thing","think","thinking","third","thirty","this","thorough","thoroughly","those","though","thought",
        "thousand","threat","threaten","three","throat","through","throughout","throw","thus","ticket","tide","tight",
        "timber","time","timeline","tiny","tissue","title","tobacco","today","together","toilet","token","tolerance",
        "tomorrow","tone","tongue","tonight","tool","tooth","topic","total","totally","touch","tough","tour","tourism",
        "tourist","tournament","toward","towards","tower","town","trace","track","trade","trading","tradition",
        "traditional","traffic","tragedy","trail","train","trainer","training","trait","transaction","transfer",
        "transform","transformation","transition","translate","translation","transmission","transport","transportation",
        "trap","travel","traveler","treasure","treat","treatment","treaty","tree","tremendous","trend","trial","tribe",
        "tribute","trick","trigger","trillion","trip","triumph","troop","tropical","trouble","truck","true","truly",
        "trust","truth","tube","tuesday","tumor","tunnel","turn","twelve","twenty","twice","twin","twist","typical",
        "typically","ugly","ultimate","ultimately","unable","uncle","undergo","underlying","understand","understanding",
        "unfortunately","uniform","union","unique","unit","united","unity","universal","universe","university","unknown",
        "unless","unlike","unlikely","until","unusual","update","upon","upper","upset","urban","urge","urgent","usage",
        "useful","user","usual","usually","utility","utilize","vacation","vacuum","valid","valley","valuable","value",
        "variable","variation","variety","various","vary","vast","vegetable","vehicle","vendor","venture","venue",
        "verb","verdict","verify","version","versus","vertical","very","vessel","veteran","viable","vice","victim",
        "victory","video","view","viewer","village","violate","violation","violence","violent","virtual","virtually",
        "virtue","virus","visible","vision","visit","visitor","visual","vital","vitamin","vocabulary","voice","volume",
        "voluntary","volunteer","vote","voter","voting","vulnerable","wage","wait","wake","walk","walking","wall",
        "wander","want","warm","warn","warning","warrant","wash","waste","watch","water","wave","weakness","wealth",
        "wealthy","weapon","wear","weather","website","wedding","wednesday","week","weekend","weekly","weigh","weight",
        "weird","welcome","welfare","well","west","western","wet","whale","what","whatever","wheat","wheel","when",
        "whenever","where","whereas","wherever","whether","which","while","whisper","white","whoever","whole","whom",
        "whose","why","wide","widely","widespread","wife","wild","wildlife","willing","wind","window","wine","wing",
        "winner","winter","wire","wisdom","wise","wish","with","withdraw","withdrawal","within","without","witness",
        "woman","women","wonder","wonderful","wood","wooden","word","work","worker","working","workshop","world",
        "worldwide","worry","worse","worship","worst","worth","would","wound","wrap","writer","writing","wrong",
        "yard","yeah","year","yellow","yesterday","yield","young","youngster","your","yours","yourself","youth",
        "zero","zone","zucchini"
    ];

    // Pre-build index for fast lookup
    const wordsByPattern = new Map();
    
    function buildWordIndex() {
        WORDS.forEach(word => {
            const w = word.toLowerCase();
            for (let i = 0; i < w.length; i++) {
                for (let len = 2; len <= 4 && i + len <= w.length; len++) {
                    const pattern = w.substring(i, i + len);
                    if (!wordsByPattern.has(pattern)) {
                        wordsByPattern.set(pattern, []);
                    }
                    wordsByPattern.get(pattern).push(word);
                }
            }
        });
        
        // Sort each pattern's words by length (shortest first)
        wordsByPattern.forEach((words, pattern) => {
            const unique = [...new Set(words)];
            unique.sort((a, b) => a.length - b.length);
            wordsByPattern.set(pattern, unique);
        });
        
        console.log('[JKLM Bot] Index built:', wordsByPattern.size, 'patterns');
    }

    function findBestWord(syllable) {
        const pattern = syllable.toLowerCase().trim();
        const matches = wordsByPattern.get(pattern);
        if (matches && matches.length > 0) {
            return matches[0]; // Shortest word
        }
        
        // Fallback: linear search
        for (const word of WORDS) {
            if (word.toLowerCase().includes(pattern)) {
                return word;
            }
        }
        return null;
    }

    // ========== DOM INTERACTION ==========
    let lastSyllable = '';
    let usedWords = new Set();

    function getSyllable() {
        // Try multiple selectors
        const selectors = [
            '.syllable',
            '.bomb .syllable',
            '.round .syllable',
            '[class*="syllable"]',
            '.seating .syllable'
        ];
        
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el && el.textContent) {
                return el.textContent.trim().toLowerCase();
            }
        }
        
        // Fallback: find by examining all elements
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
            if (el.children.length === 0 && el.textContent) {
                const text = el.textContent.trim();
                if (text.length >= 2 && text.length <= 4 && /^[a-zA-Z]+$/.test(text)) {
                    const style = window.getComputedStyle(el);
                    if (parseInt(style.fontSize) > 20) {
                        return text.toLowerCase();
                    }
                }
            }
        }
        
        return null;
    }

    function getInputField() {
        // Find the game input field
        const selectors = [
            'input.styled',
            'input[type="text"]:not([disabled])',
            'form input',
            '.selfTurn input',
            '.round input'
        ];
        
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el && !el.disabled && el.offsetParent !== null) {
                return el;
            }
        }
        return null;
    }

    function isMyTurn() {
        const input = getInputField();
        if (!input) return false;
        
        // Check if input is visible and not disabled
        const rect = input.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        if (input.disabled) return false;
        
        // Check for self turn indicator
        const selfTurn = document.querySelector('.selfTurn, .self.turn, [class*="selfTurn"]');
        if (selfTurn) return true;
        
        // Check if we can focus the input
        return document.activeElement === input || input.offsetParent !== null;
    }

    function typeAndSubmit(word) {
        const input = getInputField();
        if (!input) {
            console.log('[JKLM Bot] No input field found');
            return false;
        }

        console.log('[JKLM Bot] Typing:', word);
        
        // Focus and clear
        input.focus();
        input.value = '';
        
        // Simulate typing
        for (let i = 0; i < word.length; i++) {
            setTimeout(() => {
                input.value = word.substring(0, i + 1);
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keydown', { key: word[i], bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keyup', { key: word[i], bubbles: true }));
            }, i * CONFIG.typeDelay);
        }
        
        // Submit after typing
        setTimeout(() => {
            // Try Enter key
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            });
            input.dispatchEvent(enterEvent);
            
            // Also try form submit
            const form = input.closest('form');
            if (form) {
                form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
            
            usedWords.add(word.toLowerCase());
        }, word.length * CONFIG.typeDelay + 50);
        
        return true;
    }

    // ========== OVERLAY UI ==========
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'jklm-bot-overlay';
        overlay.innerHTML = `
            <style>
                #jklm-bot-overlay {
                    position: fixed;
                    top: 10px;
                    left: 10px;
                    background: rgba(0,0,0,0.9);
                    border: 2px solid #ff6b35;
                    border-radius: 10px;
                    padding: 12px;
                    z-index: 999999;
                    font-family: Arial, sans-serif;
                    color: white;
                    font-size: 14px;
                    min-width: 180px;
                }
                #jklm-bot-overlay .title {
                    font-weight: bold;
                    color: #ffd93d;
                    margin-bottom: 8px;
                }
                #jklm-bot-overlay .row {
                    margin: 4px 0;
                }
                #jklm-bot-overlay .syllable {
                    color: #ff6b35;
                    font-size: 20px;
                    font-weight: bold;
                }
                #jklm-bot-overlay .word {
                    color: #2ed573;
                    font-size: 18px;
                    font-weight: bold;
                }
                #jklm-bot-overlay .status {
                    color: #888;
                    font-size: 12px;
                }
                #jklm-bot-overlay label {
                    cursor: pointer;
                }
                #jklm-bot-overlay input[type="checkbox"] {
                    margin-right: 5px;
                }
            </style>
            <div class="title">💣 JKLM Bot v3</div>
            <div class="row">Syllable: <span class="syllable" id="bot-syl">---</span></div>
            <div class="row">Word: <span class="word" id="bot-word">---</span></div>
            <div class="row status" id="bot-status">Initializing...</div>
            <div class="row">
                <label><input type="checkbox" id="bot-toggle" checked> Auto-play</label>
            </div>
        `;
        document.body.appendChild(overlay);
        
        document.getElementById('bot-toggle').addEventListener('change', (e) => {
            CONFIG.enabled = e.target.checked;
        });
        
        return overlay;
    }

    function updateOverlay(syllable, word, status) {
        const sylEl = document.getElementById('bot-syl');
        const wordEl = document.getElementById('bot-word');
        const statusEl = document.getElementById('bot-status');
        
        if (sylEl) sylEl.textContent = syllable ? syllable.toUpperCase() : '---';
        if (wordEl) wordEl.textContent = word || '---';
        if (statusEl) statusEl.textContent = status || '';
    }

    // ========== MAIN GAME LOOP ==========
    function gameLoop() {
        const syllable = getSyllable();
        const myTurn = isMyTurn();
        
        if (syllable && syllable !== lastSyllable) {
            lastSyllable = syllable;
            const word = findBestWord(syllable);
            
            if (CONFIG.debugMode) {
                console.log('[JKLM Bot] Syllable:', syllable, '| Word:', word, '| MyTurn:', myTurn);
            }
            
            updateOverlay(syllable, word, myTurn ? '🎯 YOUR TURN!' : 'Watching...');
            
            if (CONFIG.enabled && myTurn && word) {
                const delay = CONFIG.minDelay + Math.random() * (CONFIG.maxDelay - CONFIG.minDelay);
                setTimeout(() => {
                    if (isMyTurn()) {
                        typeAndSubmit(word);
                        updateOverlay(syllable, word, '✅ Played: ' + word);
                    }
                }, delay);
            }
        } else if (syllable) {
            updateOverlay(syllable, findBestWord(syllable), myTurn ? '🎯 YOUR TURN!' : 'Waiting...');
        }
        
        setTimeout(gameLoop, 100);
    }

    // ========== INITIALIZATION ==========
    function init() {
        console.log('[JKLM Bot] Initializing on', window.location.href);
        
        buildWordIndex();
        
        if (CONFIG.showOverlay) {
            // Wait for body
            const waitForBody = setInterval(() => {
                if (document.body) {
                    clearInterval(waitForBody);
                    createOverlay();
                    updateOverlay(null, null, 'Ready! Waiting for game...');
                    gameLoop();
                }
            }, 100);
        } else {
            gameLoop();
        }
    }

    // Start after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 500);
    }

})();
