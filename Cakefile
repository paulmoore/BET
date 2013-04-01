# Cakefile
#
# Build file for BET
#
# https://github.com/paulmoore/BET
# http://paulmoore.mit-license.org

{exec} = require 'child_process'
{log} = console

option '-t', '--test', 'Build the unit tests as well'

task 'clean', 'Clean any previous build in lib/', -> clean()

task 'lint', 'Run coffeelint over the src/ directory and print out the results', -> lint()

task 'build', 'Build project from src/ to lib/ and copy necessary files to output directory', (options) -> build options

task 'sbuild', 'Runs build, needed for Sublime Text 2 builds', (options) -> build options

clean = (next) ->
  # Delete old build.
  log 'Attempting to delete build in lib/'
  exec 'rm -rfv ./lib/', (err, stdout, stderr) ->
    throw err if err
    msg = stdout + stderr
    log msg if msg isnt ''
    log 'Done delete'
    log 'Done clean'
    next?()
    
lint = (next) ->
  # Run coffeelint over the source code.
  log 'Attempting to lint src/'
  exec 'coffeelint -r -f ./coffeelint.json ./src/', (err, stdout, stderr) ->
    msg = stdout + stderr
    log msg if msg isnt ''
    # This will be thrown if an 'error' level lint error occurs.
    throw err if err
    log 'Done lint'
    next?()

build = (options) ->
  log '----------------------------'
  log '--     CAKEFILE BUILD     --'
  log '----------------------------'
  clean -> lint ->
    # Build the project with the CoffeeScript compiler.
    console.log 'Attempting to compile src/ to lib/'
    source = if options.test then './src/ ./test/' else './src/'
    map = if options.test then '-m' else ''
    exec "coffee -c #{map} -o ./lib/ #{source}", (err, stdout, stderr) ->
      throw err if err
      msg = stdout + stderr
      log msg if msg isnt ''
      log 'Done compile'
      log 'Done build'
      log '----------------------------'
