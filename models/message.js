module.exports= function (sequelize, Datatypes) {
	return sequelize.define('message',{
		name:Datatypes.STRING,
		text:Datatypes.STRING,
		timestamp:Datatypes.STRING,
		room:Datatypes.STRING,
	});
};