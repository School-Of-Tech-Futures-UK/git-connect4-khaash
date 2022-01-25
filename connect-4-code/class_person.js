// class person{

//     name=""

//     interests=[]

//     constructor(name){
//         this.name=name
//     }

//     addInterest(interest){
//         this.interests.push(interest)
//     }

// }

// const p1 = new person("Khaash")
// p1.addInterest("Fitness")
// console.log(p1)



class Drink {
    temperature = 10
    fizzy=false

    constructor(temp){
        this.temperature=temp
    }
    
    isFizzy(){
        return this.fizzy
    }
}

class SoftDrink extends Drink{
    
    constructor(fizz, temp)
    {
        super(temp)
        this.fizzy=fizz
    }

}

const pepsi = new SoftDrink(true, 10)

console.log(pepsi.isFizzy())