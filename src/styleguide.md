# Coding Styleguide

## Components

* Every JS Component should live in './src/assets/js/components'
* if more components are doing similar tasks, components should be grouped in an new directory
* code wich is not related has to be separeted with three linebreaks (eg. import statements, class, functions)
* code has to be seperated with two linebreak when before or after a statement follows a {} or [] (e.g. inside of functions, if-statements, json-objects)
* code has to be separeted with two line breaks if not closly related (e.g. var width and var counter)
* everything which is related has to be sepereted by one linebreak (e.g. var width and var height, )

### example component
```js
import * as exampleDependency from 'dependecy';


class MyComponent {

  constructor(myArgument, myNotCloseRelatedArgument, myCloseRelatedArgument) {

    this.myArgument = myArgument;
    this.myCloseRelatedArgument = myCloseRelatedArgument;

    this.myNotCloseRelatedArgument = myNotCloseRelatedArgument;

    if(this.myNotCloseRelatedArgument == 1){

      return render(5);

    }

  }


  render(new_data) {

    //using myArgument inside here
    let myArgument = this.myArgument;
    // doStuff with myArgument

    return new_data + myArgument

  }

}


export { MyComponent as default };
```

* a component consists at minimum of two functions 
* constructor, and render
* constructor: create for every arguement passed to it a this.arguement, so its available inside this class
* render: usually called in the constructor but not forced to, it displays something on the screen
* at the beginning import every dependecy with the es6 import statement
* at the end of the document export the class as default