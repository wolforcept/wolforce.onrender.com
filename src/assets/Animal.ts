import camel from "assets/animals/camel.svg";
import crocodile from "assets/animals/crocodile.svg";
import deer from "assets/animals/deer.svg";
import dolphin from "assets/animals/dolphin.svg";
import elephant from "assets/animals/elephant.svg";
import flamingo from "assets/animals/flamingo.svg";
import fox from "assets/animals/fox.svg";
import giraffe from "assets/animals/giraffe.svg";
import goat from "assets/animals/goat.svg";
import gorilla from "assets/animals/gorilla.svg";
import hippo from "assets/animals/hippo.svg";
import kangaroo from "assets/animals/kangaroo.svg";
import koala from "assets/animals/koala.svg";
import lion from "assets/animals/lion.svg";
import llama from "assets/animals/llama.svg";
import macaw from "assets/animals/macaw.svg";
import meerkat from "assets/animals/meerkat.svg";
import monkey from "assets/animals/monkey.svg";
import ostrich from "assets/animals/ostrich.svg";
import owl from "assets/animals/owl.svg";
import penguin from "assets/animals/penguin.svg";
import polarbear from "assets/animals/polarbear.svg";
import rabbit from "assets/animals/rabbit.svg";
import raccoon from "assets/animals/raccoon.svg";
import rhino from "assets/animals/rhino.svg";
import sealion from "assets/animals/sealion.svg";
import sloth from "assets/animals/sloth.svg";
import squirrel from "assets/animals/squirrel.svg";
import zebra from "assets/animals/zebra.svg";
import wolf from "assets/animals/wolf.svg";

const animals = {
    camel, crocodile, deer, dolphin, elephant, flamingo, fox, giraffe, goat, gorilla, hippo, kangaroo, koala, lion, llama, macaw, meerkat, monkey, ostrich, owl, penguin, polarbear, rabbit, raccoon, rhino, sealion, sloth, squirrel, zebra, wolf
}

export default animals;
export const animalNames = Object.keys(animals);

export function getAnimalSrc(animalName: string) {
    return (animals as any)[animalName];
}