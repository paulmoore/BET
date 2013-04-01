A Mathematical Evaluator for CoffeeScript and JavaScript
===

This project makes use of Binary Expression Trees and the [Shunting-Yard algorithm](http://en.wikipedia.org/wiki/Shunting-yard_algorithm) to evaluate infix equations and produce a numerical result.

http://paulmoore.mit-license.org

---
## Installing

Typical NPM installation:

```CoffeeScript
npm install bet
```

---
## Usage

The library expects that you have some way of separating your tokens, whether it is a `string.split`, or something more involved, is up to you.

### Simple Example

In CoffeeScript
```CoffeeScript
# Require the module
{evaluate} = require 'bet'

# Evaluating an equation
evaluate ['1','+','isqrt','(','2','^2',')'], (error, result) ->
    console.log error ? result
```

In JavaScript
```JavaScript
// Require the module
var BET = require("bet");

// Evaluating an equation
BET.evaluate(['1','+','isqrt','(','2','^2',')'], function(error, result) {
	if (error !== null) {
		console.log(error);
	} else {
		console.log(result);
	}
});
```

There is also a synchronous method
```CoffeeScript
{evaluateSync} = require 'bet'
try
    val = evaluateSync [1, '+', 2]
    console.log val
    # throws an error
    evaluateSync ['*', '+', 1, 'x']
catch e
    console.log e
```

You will want to check the source to see the full list of built-in operators and functions that are currently supported.

### Custom Operators

You can define or redefine operators as you wish.

```CoffeeScript
{evaluate, operators} = require 'bet'

# C style logical AND
operators['&&'] =
    assoc: 'left'
    prec: 0
    argc: 2
    fix: 'in'
    exec: (args) -> 1 if args[0] isnt 0 and args[1] isnt 0 else 0

evaluate [1,'&&',1,'&&',0], (error, result) ->
	console.log error ? result
```

Operators require the following attributes:

1. __assoc__: Associativity _['left' or 'right']_ Associativity indicates the order in which operators of the same precedence are executed.  For instance, `&&` has an associativity of 'left' and thus `a && b && c` is evaluated as `(a && b) && c`.

2. __prec__: Precedence _[integer]_ Operators with a higher precedence (higher value) are executed first.  For instance, `1 + 2 * 3` is evaluated as `1 + (2 * 3)`.

3. __argc__: Argument count _[integer]_ The number of numerical operands an operator needs to execute.  In practice this is usually only 1 (for unary) or 2 (for binary) operators.  For instance, `+` requires 2 operands e.g. `1 + 2`, whereas `1 +` will produce an error.

4. __fix__: How the operator is 'fixed' _['in', 'pre', or 'post']_ Most binary operators are infixed, meaning the operator is between the operands e.g. `1 / 2`.  Unary operators are usually either pre or post fixed, e.g. `5 !` (postfixed) or `not 1` (prefixed).  However, you can also have infixed unary operators (just be careful with associativity!) such as pre and post increment/decrement, e.g. `++1` and `1++` are both valid.

5. __exec__: Evaluator _[function]_ This is the function that is called to evaluate the operator.  It is given a single argument as an array, with length argc.  All values are numerical.

### Custom Functions

Functions are similar to operators.  You can also define new or redefine functions.  Functions in this library are invoked C style `fn(arg1,arg2,arg3)`.  Currently, variable argument functions are not supported.  Function arguments can be expressions in themselves.  Functions cannot have the same name as an operator.

```CoffeeScript
{evaluate, functions} = require 'bet'

# Averages 3 numbers
functions['avg'] =
    argc: 3
    exec: (args) -> (args[0] + args[1] + args[2]) / 3

evaluate ['avg','(',1,2,3,')'], (error, result) ->
	console.log error ? result
```

Declaration of a function is much like an operator.  However it requires only 2 attributes:

1. __argc__: Argument count _[integer]_ The number or arguments the function takes.

2. __exec__: Evaluator _[function]_ This is the function that is called to evaluate the function.  It is passed an array of in order numerical arguments.

---
## But JavaScript IS a Mathematical Evaluator

Good point.  Here is one particular use case that prompted me to write this library:

### A Basic Approach

You are writting a game involves players entering equations.  You may at first do something like this:

```CoffeeScript
# Spaces are used to separate tokens.
# User enters an equation, we end up with a string like this:
eqn = '1 + 2'
result = eval eqn
doSomethingWith result
```

This will work, and for most basic math operators will do what you need.

### A More Complicated Example

Let's say you don't want to deal with fractions or decimals, you want your operations to have integer only results.  So then you may say _"Ok, I'll write a preprocessor to `Math.floor` division operators"_

```CoffeeScript
eqn = '1 + 2 / 3'
# You run it through a parser that produces this:
eqn = '1 + Math.floor(2 / 3)'
# ...
```

But then the User enters something invalid:

```CoffeeScript
eqn = '1 + 2 3 / 2'
# parse it...
eqn = '1 + 2 Math.floor(3 / 2)'
# errors
```

Or should it have been?:

```CoffeeScript
eqn = '1 + 2 3 / 2'
# parse it...
eqn = '1 + Math.floor(23 / 2)'
# errors
```

You also have to watch out for:

```CoffeeScript
eqn = '1 + (3 + 2) / 2'
# parse it...
eqn = '1 + (3 + 2 Math.floor() / 2)'
# errors
```

Anyways, the problem starts to compound when you need things like:

1. Custom operators
2. Built-in and user-defined functions
3. Associativity, precedence, and argument length control
4. Error reporting of _what_ went wrong when an expression does not evaluate

---
## Using Binary Expression Trees to your Advantage

Luckily this problem has been solved long before I was born.  The idea is, once you have separated the equation into individual tokens to rearrange them according to their precedence.  Then you can the equation, in [Reverse Polish Notation](http://en.wikipedia.org/wiki/Reverse_Polish_notation), and execute it.

So, if you start with an equation like this:

```
1 + 2 * 3 + 4 ^ 5
```

You produce the expression tree in RPN format as follows:

```
1 2 3 * + 2 3 2 ^ ^ +
```

Which gives you the correct order of operations, so you can simply execute the equation as a stack if you know how many arguments each operator takes:

```
> pop
[1]
> pop
[1, 2]
> pop
[1, 2, 3]
> evaluate *
[1, 6]
> evaluate +
[7]
> pop
[7, 2]
> pop
[7, 2, 3]
> pop
[7, 2, 3, 2]
> evaluate ^
[7, 2, 9]
> evaluate ^
[7, 512]
> evaluate +
> [519]
```

...Or you can find a better explanation of BETs and RPN works [here](http://en.wikipedia.org/wiki/Reverse_polish_notation)
