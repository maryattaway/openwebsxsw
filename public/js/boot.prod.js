require(["log", "zepto.min"], function(l, zepto){
  log('Zepto and Log loaded...')
  require(["openwebsxsw-0.0.1-3.min"], function(openwebsxsw){
    log('All JS files loaded...')
  })
})