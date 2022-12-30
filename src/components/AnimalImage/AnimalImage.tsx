import { getAnimalSrc } from 'assets/Animal';
import { FC } from 'react';

interface AnimalProps {
    animal: string;
    height: number | string
}

const AnimalImage: FC<AnimalProps> = function ({ animal, height }) {

    return (
        <img className='AnimalImage' height={height} src={getAnimalSrc(animal)} alt={animal} about={animal} title={animal} />
    )
}

export default AnimalImage;
