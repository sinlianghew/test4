const path =                        require("path")
const common =                      require("./webpack.common")
const merge =                       require("webpack-merge")
const MiniCssExtractPlugin =        require("mini-css-extract-plugin")
const { CleanWebpackPlugin } =      require("clean-webpack-plugin") // only need in prod cuz dev is using in-memory server
const SVGSpritemapPlugin =          require("svg-spritemap-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    // optimization: {
	// 	minimize: false
	// },
    entry: "./src/js/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'js/[name].js',
        // publicPath: '~/spa-assets/' // comment this out when building for Firebase
    },
    module: {
        rules: [
            // {
            //     // handle the HTML files
            //     test: /.html$/,
            //     use: ["html-loader"]
            // },
            {
                test: /\.twig$/,
                use: [
                    'html-loader',
                    'twig-html-loader'
                ]
            },
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                exclude: /fonts/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "/spa-assets/img"
                    }
                }
            },
            {
                test: /\.(svg|eot|ttf|woff|woff2)$/,
                exclude: [/img/, /img\/icons/],
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "/spa-assets/fonts"
                    }
                }
            },
            {
                test: [/.js$/],
                exclude: /node_modules[\/\\](?!(swiper|dom7)[\/\\])/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /.(sa|sc|c)ss$/,
                use: [
                    // Transform css and extract into separate single bundle
                    // Required to generate the file
                    { 
                        loader: MiniCssExtractPlugin.loader
                    },

                    // Handles url() and @imports
                    { 
                        loader: "css-loader",
                        // options: { url: false }
                    },

                    // apply postcss transforms like autoprefixer and minify
                    { loader: "postcss-loader" },

                    "resolve-url-loader",
                    
                    // transform SASS to CSS
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                        }
                    } 
                ]
            }
        ]
    },
    plugins: [
        new SVGSpritemapPlugin("src/spa-assets/icons/**/*.svg", {
            output: {
                filename: "/spa-assets/icons/icons.svg",
            }
        }),
        new CleanWebpackPlugin()
    ]
})