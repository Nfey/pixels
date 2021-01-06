class Person {
    name;
    age;
    constructor(name, age){
        this.name = name;
        this.age = age;
    }
    sayName(){
        console.log(`My name is ${this.name}`);
    }
}


var myPerson2 = new Person("Nathan", 21);



//these are the same:
var myPerson = new Person("Nick", 21);
var myPerson3 = {
    name: "Nick",
    age: 21,
    sayName: () => {
        console.log(`My name is ${this.name}`);
    }
}

myPerson.sayName();
myPerson3.sayName();

var name = new String();
var name = "";