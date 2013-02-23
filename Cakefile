# Cakefile
#
# Build file for BET
#
# http://paulmoore.mit-license.org

{exec} = require 'child_process'
{log} = console

clean = (next) ->
  # Delete old build.
  log 'Attempting to delete build in lib/'
  exec 'rm -rfv ./lib/', (err, stdout, stderr) ->
    throw err if err
    msg = stdout + stderr
    log msg if msg isnt ""
    log 'Done delete'
    log 'Done clean'
    next?()

task 'clean', 'Clean any previous build in lib/', -> clean()
    
lint = (next) ->
  # Run coffeelint over the source code.
  log 'Attempting to lint src/'
  exec 'coffeelint -r -f ./coffeelint.json ./src/', (err, stdout, stderr) ->
    msg = stdout + stderr
    log msg if msg isnt ""
    # This will be thrown if an 'error' level lint error occurs.
    throw err if err
    log 'Done lint'
    next?()
    
task 'lint', 'Run coffeelint over the src/ directory and print out the results', -> lint()

task 'build', 'Build project from src/ to lib/ and copy necessary files to output directory', ->
  log '----------------------------'
  log '--     CAKEFILE BUILD     --'
  log '----------------------------'
  clean -> lint ->
    # Build the project with the CoffeeScript compiler.
    console.log 'Attempting to compile src/ to lib/'
    exec 'coffee -c -o ./lib/ ./src/', (err, stdout, stderr) ->
      throw err if err
      msg = stdout + stderr
      log msg if msg isnt ""
      log 'Done compile'
      log 'Done build'
      log '----------------------------'
