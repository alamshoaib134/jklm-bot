// Quick test - paste in falcon.jklm.fun console
(function(){
    console.log('🔍 Testing BombParty Bot...');
    
    // Check 1: Can we find syllable?
    const sylEl = document.querySelector('.syllable');
    console.log('Syllable element:', sylEl);
    console.log('Syllable text:', sylEl?.textContent);
    
    // Check 2: Is it your turn?
    const selfTurn = document.querySelector('.selfTurn');
    console.log('SelfTurn element:', selfTurn);
    console.log('Is your turn?', !!selfTurn);
    
    // Check 3: Can we find input?
    const input = document.querySelector('.selfTurn input') || document.querySelector('input.styled');
    console.log('Input element:', input);
    
    // Check 4: List all inputs
    const allInputs = document.querySelectorAll('input');
    console.log('All inputs:', allInputs.length);
    allInputs.forEach((inp, i) => {
        console.log(`  Input ${i}:`, inp.className, inp.type, inp.placeholder);
    });
    
    // Check 5: Page location
    console.log('URL:', location.href);
    console.log('Expected: falcon.jklm.fun');
    
    if(location.href.includes('falcon.jklm.fun')){
        console.log('✅ Correct context (iframe)');
    } else {
        console.log('❌ WRONG CONTEXT! Switch console to falcon.jklm.fun');
    }
})();
