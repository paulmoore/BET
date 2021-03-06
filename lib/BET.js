// Generated by CoffeeScript 1.6.1
(function() {
  var BET, ceil, evaluate, floor, functions, max, min, operators, pow, shuntingYard, sqrt;

  pow = Math.pow, sqrt = Math.sqrt, floor = Math.floor, ceil = Math.ceil, min = Math.min, max = Math.max;

  operators = {
    '+': {
      assoc: 'left',
      prec: 1,
      argc: 2,
      fix: 'in',
      exec: function(args) {
        return args[0] + args[1];
      }
    },
    '-': {
      assoc: 'left',
      prec: 1,
      argc: 2,
      fix: 'in',
      exec: function(args) {
        return args[0] - args[1];
      }
    },
    '*': {
      assoc: 'left',
      prec: 2,
      argc: 2,
      fix: 'in',
      exec: function(args) {
        return args[0] * args[1];
      }
    },
    '/': {
      assoc: 'left',
      prec: 2,
      argc: 2,
      fix: 'in',
      exec: function(args) {
        return args[0] / args[1];
      }
    },
    'i/': {
      assoc: 'left',
      prec: 2,
      argc: 2,
      fix: 'in',
      exec: function(args) {
        return floor(args[0] / args[1]);
      }
    },
    '%': {
      assoc: 'left',
      prec: 2,
      argc: 2,
      fix: 'in',
      exec: function(args) {
        return args[0] % args[1];
      }
    },
    'mod': {
      assoc: 'left',
      prec: 2,
      argc: 2,
      fix: 'in',
      exec: function(args) {
        return (args[0] % args[1] + args[1]) % args[1];
      }
    },
    'neg': {
      assoc: 'right',
      prec: 3,
      argc: 1,
      fix: 'pre',
      exec: function(args) {
        return -args[0];
      }
    },
    '^': {
      assoc: 'right',
      prec: 3,
      argc: 2,
      fix: 'in',
      exec: function(args) {
        return pow(args[0], args[1]);
      }
    },
    '^2': {
      assoc: 'left',
      prec: 4,
      argc: 1,
      fix: 'post',
      exec: function(args) {
        return args[0] * args[0];
      }
    },
    '^3': {
      assoc: 'left',
      prec: 4,
      argc: 1,
      fix: 'post',
      exec: function(args) {
        return args[0] * args[0] * args[0];
      }
    },
    '!': {
      assoc: 'right',
      prec: 4,
      fix: 'post',
      argc: 1,
      exec: function(args) {
        var i, r;
        r = 1;
        i = 2;
        while (i <= args[0]) {
          r *= i;
          i++;
        }
        return r;
      }
    },
    '++': {
      assoc: 'left',
      prec: 5,
      fix: 'in',
      argc: 1,
      exec: function(args) {
        return ++args[0];
      }
    },
    '--': {
      assoc: 'left',
      prec: 5,
      fix: 'in',
      argc: 1,
      exec: function(args) {
        return --args[0];
      }
    }
  };

  functions = {
    'sqrt': {
      argc: 1,
      exec: function(args) {
        return sqrt(args[0]);
      }
    },
    'isqrt': {
      argc: 1,
      exec: function(args) {
        return floor(sqrt(args[0]));
      }
    },
    'floor': {
      argc: 1,
      exec: function(args) {
        return floor(args[0]);
      }
    },
    'ceil': {
      argc: 1,
      exec: function(args) {
        return ceil(args[0]);
      }
    },
    'min': {
      argc: 2,
      exec: function(args) {
        return min(args[0], args[1]);
      }
    },
    'max': {
      argc: 2,
      exec: function(args) {
        return max(args[0], args[1]);
      }
    }
  };

  shuntingYard = function(input) {
    var i, matched, op1, op2, output, stack, token, token2, _i, _len;
    output = [];
    stack = [];
    for (i = _i = 0, _len = input.length; _i < _len; i = ++_i) {
      token = input[i];
      if (operators[token] != null) {
        op1 = operators[token];
        switch (op1.fix) {
          case 'pre':
            stack.push(token);
            break;
          case 'post':
            output.push(token);
            break;
          case 'in':
            while (stack.length > 0) {
              token2 = stack[stack.length - 1];
              if (operators[token2] != null) {
                op2 = operators[token2];
                if (op1.assoc === 'left' && op1.prec <= op2.prec || op1.prec < op2.prec) {
                  output.push(stack.pop());
                  continue;
                }
              }
              break;
            }
            stack.push(token);
            break;
          default:
            return new Error("Operator " + token + " at index " + i + " has invalid fix property: " + op1.fix + ", found in: " + (input.join('')));
        }
      } else if (functions[token] != null) {
        stack.push(token);
      } else if (token === ',') {
        while (stack.length > 0) {
          token = stack[stack.length - 1];
          if (token !== '(') {
            output.push(token);
            stack.pop();
          } else {
            matched = true;
            break;
          }
        }
        if (!matched) {
          return new Error("Parse error, no matching left paren for function at index " + i + " of " + (input.join('')));
        }
      } else if (token === '(') {
        stack.push(token);
      } else if (token === ')') {
        while (stack.length > 0) {
          token = stack.pop();
          if (token === '(') {
            matched = true;
            break;
          } else {
            output.push(token);
          }
        }
        if (!matched) {
          return new Error("Parse error, no matching left paren at index " + i + " of " + (input.join('')));
        }
        if (stack.length > 0 && (functions[stack[stack.length - 1]] != null)) {
          output.push(stack.pop());
        }
      } else if (typeof token === 'number') {
        output.push(token);
      } else {
        return new Error("Parse error, token " + token + " is not a known operator, paren, or number type at index " + i + " of " + (input.join('')));
      }
    }
    while (stack.length > 0) {
      token = stack.pop();
      if (token === '(' || token === ')') {
        return new Error("Parse error, mismatched parens, found extra " + token + " in " + (input.join('')) + ", operators left in stack: " + (stack.join(' ')));
      } else {
        output.push(token);
      }
    }
    return output;
  };

  evaluate = function(input, next) {
    var args, error, fnop, i, output, queue, result, stack, token, top;
    result = NaN;
    error = null;
    if (!Array.isArray(input)) {
      error = new Error("Input must be array but got " + ((input != null ? input.toString() : void 0) || 'null'));
    } else if (input.length === 1 && typeof input[0] === 'number') {
      result = input[0];
    } else {
      output = shuntingYard(input);
      if (output instanceof Error) {
        error = output;
      } else {
        queue = output;
        stack = [];
        while (queue.length + stack.length > 0) {
          if (queue.length > 0) {
            token = queue.shift();
            stack.push(token);
          }
          if (stack.length > 0) {
            top = stack[stack.length - 1];
            fnop = operators[top] || functions[top];
            if ((fnop != null) && stack.length > fnop.argc) {
              stack.pop();
              args = [];
              i = fnop.argc;
              while (i > 0) {
                args.unshift(stack.pop());
                i--;
              }
              result = fnop.exec(args);
              if (queue.length + stack.length > 0) {
                stack.push(result);
              }
            } else if (queue.length === 0) {
              error = new Error("Cannot make any progress on equation, did you misplace a unary operator? stack: " + (stack.toString()));
              result = NaN;
              break;
            }
          }
        }
      }
    }
    if (isNaN(result) && (error == null)) {
      error = new Error('Calculation error, check equation syntax');
    }
    return typeof next === "function" ? next(error, result) : void 0;
  };

  BET = {};

  BET.operators = operators;

  BET.functions = functions;

  if ((typeof process !== "undefined" && process !== null ? process.nextTick : void 0) != null) {
    BET.evaluate = function(input, next) {
      return process.nextTick(function() {
        return evaluate(input, next);
      });
    };
  }

  BET.evaluateSync = function(input) {
    var ret;
    ret = NaN;
    evaluate(input, function(err, res) {
      if (err != null) {
        throw err;
      }
      return ret = res;
    });
    return ret;
  };

  if (typeof module !== "undefined" && module !== null) {
    module.exports = BET;
  }

  if (typeof window !== "undefined" && window !== null) {
    window.BET = BET;
  }

}).call(this);
