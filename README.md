# Calculator project

simple calculator.

1. multiply, divide, subtract, addition operators.



2. change sign operator

4. add decimal point operator

5. operation operator


# what I felt after this 1 wwek of project

## I tend to just start it.

But after do this project, I felt more like, "I should prefer to make class abtract specifications".

There's a lot of code that better do refactoring, but too much code is kinda "spaghetti".

It seems more harder that to do refactor these codes after "just do it"

## I should search more about knowledges.

As I know, JavaScript is using deciaml floating point numbers basically.

And I know that decimal floating point numbers have a lot of problems for doing operation.

Final moment of this project, I was too much confused to make code for "calculate split the string, string to number, number to string..".

and I searched about it, and there's new JS type called "BigInt".

I should use that from the beginning.

## Basic syntax problems.

I used "switch-case" syntax inthis project.

And everytime when I was declaring variables in each cases, I got ESling Error "unexpected lexical declaration in case block".

Problem was in switch case syntax, each cases are NOT a block scope.

So when someone tries to declare viables, that variables are declared by scope  where that switch case syntax are in.

Then how to solve it?

Easy.

Just cover with `{ }` at a case which you want to declare some variable in that case.

Like

```js
switch(a) {
  case 1: {
    const var1 = "x";
    const var2 = 2;
    ...
    break;
  }
}
```
