module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/admin/' : '/',
  outputDir: 'admin',
  devServer: {
		proxy:"http://192.168.1.79:8061"
	}
};
 
