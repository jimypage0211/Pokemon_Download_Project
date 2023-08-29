import * as fs from "fs/promises";

let pokeSpritesOutput = async function(pokemon){
    let sprites = pokemon.sprites; //{}
    let bufferPromisesArray = [];
    let paths = [];
    for (const sprite of Object.keys(sprites)) {
        if(sprite === "other")
            break;
        if(sprites[sprite] === null){
            continue;
        }
        paths.push(`./${pokemon.name}/${sprite}.png`);
        let imageResponse = await fetch(sprites[sprite]);
        bufferPromisesArray.push(Buffer.from(await imageResponse.arrayBuffer()));
    }
    let buffersArray = await Promise.all(bufferPromisesArray);
    for (let i=0; i<buffersArray.length; i++ ){
        await fs.writeFile(paths[i], buffersArray[i] );
    }
}

let pokeArtworkOutput = async function (pokemon){
    let artworks = pokemon.sprites.other['official-artwork']
    for (const artwork of Object.keys(artworks)) {
        if(artworks[artwork] === null){
            continue;
        }
        let path = `./${pokemon.name}/official_artwork_${artwork}.png`;
        let imageResponse = await fetch(artworks[artwork]);
        let imgBuffer = Buffer.from(await imageResponse.arrayBuffer());
        await fs.writeFile(path, imgBuffer );
    }
}
let pokemonMKDir = async function (pokeName) {
    let path = `./${pokeName}/`;
    await fs.mkdir(path, (err) => {
        if (err) {
            return console.error(err);
        }
        console.log('Directory created successfully!');
    });
}
let pokeStatsOutput = async function (pokemon){
    let outputString = '';
    let path = `./${pokemon.name}/${pokemon.name}.txt`;
    for (const stat of pokemon.stats) {
        outputString += `${stat.stat.name} - ${stat.base_stat}\n`;
    }
    await fs.writeFile(path, outputString);

}
let save = async function (pokemon, features){
    try {
        await pokemonMKDir(pokemon.name);
    }catch (err){}
    for (const feature of features) {
        switch (feature){
            case "Stats":
                await pokeStatsOutput(pokemon);
                break;
            case "Sprites":
                await pokeSpritesOutput(pokemon);
                break;
            case "Artwork":
                await pokeArtworkOutput(pokemon);
                break;
        }
    }
}
export default save;