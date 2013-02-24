
{evaluate} = require './BET'
{pow, sqrt, floor, ceil, abs} = Math

str2eqn = (str) ->
	eqn = str.split ' '
	for token, i in eqn
		num = parseFloat token
		eqn[i] = num unless typeof num isnt 'number' or isNaN num
	eqn

evalfail = (eqn, actual, expected) -> "Expression did not evaluate correctly: #{eqn.join ' '} = #{expected} ~= #{actual}"

evalcheck = (test, eqn, actual, expected) -> test.equals actual, expected, evalfail(eqn, actual, expected)

module.exports =

	'test evaluating null results in error': (test) ->
		test.expect 2
		evaluate null, (r, e) ->
			test.ok isNaN(r), "Expression is not NaN: #{r}"
			test.ok e?, 'Expression did not produce an error'
			test.done()

	'test evaluating empty array results in NaN and and error': (test) ->
		test.expect 2
		evaluate [], (r, e) ->
			test.ok isNaN(r), "Expression is not NaN: ${r}"
			test.ok e?, 'Expression did not produce an error'
			test.done()

	'test evaluating single number results in that number': (test) ->
		test.expect 2
		evaluate [1], (r, e) ->
			test.ifError e
			test.equal r, 1, 'Expression did not evaluate correctly'
			test.done()

	'test basic addition operator': (test) ->
		test.expect 2
		eqn = str2eqn '1 + -2 + 3 + -4 + 5 + -6'
		evaluate eqn, (r, e) ->
			test.ifError e
			evalcheck test, eqn, r, (1 + -2 + 3 + -4 + 5 + -6)
			test.done()

	'test basic subtraction operator': (test) ->
		test.expect 2
		eqn = str2eqn '1 - -2 - 3 - -4 - 5 - -6'
		evaluate eqn, (r, e) ->
			test.ifError e
			evalcheck test, eqn, r, (1 - -2 - 3 - -4 - 5 - -6)
			test.done()

	'test basic multiplication operator': (test) ->
		test.expect 2
		eqn = str2eqn '1 * 2 * -3 * 4 * -5'
		evaluate eqn, (r, e) ->
			test.ifError e
			evalcheck test, eqn, r, (1 * 2 * -3 * 4 * -5)
			test.done()

	'test basic division operator': (test) ->
		test.expect 2
		eqn = str2eqn 'ceil ( 10 / 2 / 3 * 10 / -1 )'
		evaluate eqn, (r, e) ->
			test.ifError e
			evalcheck test, eqn, r, (ceil(10 / 2 / 3 * 10 / -1 ))
			test.done()

	'test basic integer division operator': (test) ->
		test.expect 2
		eqn = str2eqn '10 i/ 2 i/ 2'
		evaluate eqn, (r, e) ->
			test.ifError e
			evalcheck test, eqn, r, (floor(floor(10 / 2) / 2))
			test.done()

	'test basic remainder operator': (test) ->
		test.expect 2
		eqn = str2eqn '-5 % 2'
		evaluate eqn, (r, e) ->
			test.ifError e
			evalcheck test, eqn, r, (-5 % 2)
			test.done()

	'test basic modulus operator': (test) ->
		test.expect 2
		eqn = str2eqn '-5 mod 2'
		evaluate eqn, (r, e) ->
			test.ifError e
			evalcheck test, eqn, r, (5 % 2)
			test.done()

	'test basic negation operator': (test) ->
		test.expect 2
		eqn = str2eqn '2 ^ neg 3'
		evaluate eqn, (r, e) ->
			test.ifError e
			evalcheck test, eqn, r, (1/8)
			test.done()

	'test basic exponent operator': (test) ->
		test.expect 2
		eqn = str2eqn '2 ^ 3 ^ 4'
		evaluate eqn, (r, e) ->
			test.ifError e
			evalcheck test, eqn, r, pow(2, pow(3, 4))
			test.done()

	'test basic ^2 and ^3 operators': (test) ->
		test.expect 2
		eqn = str2eqn '2 ^2 ^3'
		evaluate eqn, (r, e) ->
			test.ifError e
			evalcheck test, eqn, r, pow(2 * 2, 3)
			test.done()

	'test basic factorial operator': (test) ->
		test.expect 2
		eqn = str2eqn '4 ! - 1 ! - 0 !'
		evaluate eqn, (r, e) ->
			test.ifError e
			evalcheck test, eqn, r, (4 * 3 * 2 - 1 - 1)
			test.done()

	'test basic post increment and decrement operators': (test) ->
		test.expect 2
		eqn = str2eqn '1 ++ * 0 --'
		evaluate eqn, (r, e) ->
			test.ifError e
			evalcheck test, eqn, r, (2 * -1)
			test.done()

	'test basic pre increment and decrement operators': (test) ->
		test.expect 2
		eqn = str2eqn '++ 1 * -- 0'
		evaluate eqn, (r, e) ->
			test.ifError e
			evalcheck test, eqn, r, (2 * -1)
			test.done()
