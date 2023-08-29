import inquirer from "inquirer";
import save from './saving.js'


let fetchPokemon = async function(pokemonName){

    let resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if(resp.ok){
        return resp.text();
    }
    return "Pokemon doesnt exist";
}

let promptPokemon = async function (){
   return inquirer.prompt(
       {
           type: 'input',
           name: 'pokemonName',
           message: 'Please select your pokemon'
       }
   );
}

let promptFeatures = async function (){
    return inquirer.prompt(
        {
            type: 'checkbox',
            name: 'features',
            message: 'Select features:',
            choices: [{name: 'Stats'}, {name: 'Sprites'}, {name: 'Artwork'}],
            validate(answer) {
                if (answer.length < 1) {
                    return 'You must choose at least one feature.';
                }
                return true;
            },
        }
    );
}

let promptExitProg = async function () {
    return inquirer.prompt(
        {
            type: 'confirm',
            name: 'exit',
            message: 'Do you want to search for another Pokemon?'
        });
}

let menu = async function (){
    let notDone = true
    do {
        let nameAnswer = await promptPokemon()
        let pokeObject = await fetchPokemon(nameAnswer.pokemonName);
        if (pokeObject === "Pokemon doesnt exist") {
            console.log("Pokemon doesnt exist");
            continue;
        }
        let featuresAnswer = await promptFeatures();
        await save(JSON.parse(pokeObject), featuresAnswer.features);
        notDone = (await promptExitProg()).exit;
    }while (notDone)
}

export default menu;