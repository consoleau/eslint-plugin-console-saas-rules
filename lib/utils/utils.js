module.exports = {
  isAngularModuleCall: function(node){
      return (node.object.name === 'angular' && node.property.name === 'module')
  }
}