interface IPerson {
    name: string,
    age: number
}

const person: IPerson = {
    name: 'puxiao',
    age: 34
}

function changePerson<K extends keyof IPerson>(name: K, value: IPerson[K]): void {
    person[name] = value
}

const changePerson2: <K extends keyof IPerson>(name:K,value:IPerson[K]) => void = (key,value) => {
    person[key] = value
}

changePerson('age',18)
changePerson('name','yang')

changePerson2('name','ypx')
changePerson2('age',34)
