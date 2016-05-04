module.exports = function(grunt) {
    require('time-grunt')(grunt);

    var config = {
        product: global.productName, //项目名，用于md5后的资源 如<%- staticBase %>/xx/a.js替换成<%- staticBase %>/xx/a.131.js
        srcDir: global.srcDir, //源文件的目录, 编译文件 的来源 grunt.option('p')
        compressDir: global.releaseDir, //压缩文件的目录，上线需要压缩
        releaseDir: global.releaseDir, //编译文件的目录
        serverTaskDir: global.serverTaskDir, //服务器模板文件路径
        concatFile: global.concatFile //指定文件合并的配置
    };

    //如果没有服务器配置，采用本地配置
    if(!config.product) {
        var localConfigFile = grunt.file.read('./config/localConfig.js');
        eval(localConfigFile); //会localConfig值
        for(var key in localConfig) {
            config[key] = localConfig[key];
        }
    }

    //导入服务器template和regist
    var serverTemplateAndTask = grunt.file.read(config.serverTaskDir);
    eval(serverTemplateAndTask);//会输出templateConfig 变量（包含各个环境）和 regist（各个环境）

    var path = require('path');
    //合并 seajs 文件,可以没有合并文件
    try  {
        var concatFileSource = grunt.file.read(config.concatFile);
        eval(concatFileSource); //生成合并的 concat_config变量
        concat_config = (function generalConcatFiles(pre, files) {
            var conf = {};
            if(pre && files) {
                files.forEach(function(value) {
                    conf[ path.join(pre, value[0])] = value[1].map(function(f) {
                        return path.join(pre, f);
                    });
                });
            }
            return conf;
        })(concat_config.pre, concat_config.files);
    } catch (e) {
        concat_config = null;
    }


    var changeFilter = typeof changeFilter == 'undefined' ? function(){return true;} : changeFilter;

    grunt.initConfig({
        product : config.product,
        clean: {
            folders: [config.releaseDir, config.compressDir]
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: path.join(config.srcDir, 'src'),
                    src: ['**/*'],
                    filter: changeFilter,
                    dest: config.releaseDir
                }]
            },
            testserver: {
                files: [{
                    expand:true,
                    cwd:config.releaseDir,
                    src:['**/*'],
                    dest:config.releaseDir+'/p5/react/'
                }]
            },
            teststatic: {
                files: [{
                    expand:true,
                    cwd: config.releaseDir,
                    src:['**/*.css','**/*.js','images/**/*.*','**/*.css'],
                    dest: config.releaseDir+'/H5/react/'
                }]
            },
            server: {
                files: [{
                    expand:true,
                    cwd: config.releaseDir,
                    src:['**/*.php','**/*.html'],
                    dest: config.releaseDir+'/react/'
                }]
            },
            static: {
                files: [{
                    expand:true,
                    cwd: config.releaseDir,
                    src:['**/*.css','**/*.js','images/**/*.*','**/*.css'],
                    dest: config.releaseDir+'/static/react/'// + config.product
                }]
            }
        },
        transport: {
            options: {
                debug: false
            },
            main: {
                files: [{
                    expand: true,
                    cwd: config.releaseDir,
                    src: ['**/*.js', '!**/sea*.js'],
                    dest: config.releaseDir
                }]
            }
        },
        filerev: {
            main: {
                files: [{
                    expand: true,
                    cwd: config.releaseDir,
                    src: ['**/*.js','**/*.css'],
                    dest: config.releaseDir
                }]
            }
        },
        concat: {
            main: {
                files: concat_config
            }
        },
        concat_seajs: {
            options: {
                baseDir:config.releaseDir,
                seajs_src: config.releaseDir + '/js/base/'
            },
            main: {
                files: [{
                    expand: true,
                    cwd: config.releaseDir,
                    src: ['**/*.html','**/*.php']
                }]
            }
        },
        component: {
            main: {
                files: [{
                    expand: true,
                    cwd: config.releaseDir,
                    src: ['**/*.js']
                }]
            }
        },
        usemin: {
            html: config.releaseDir + '/**/*.php',
            css: config.releaseDir + '/css/' + '**.css',
            js: config.releaseDir + '/js/' + '**.js',
            options: {
                assetsDirs: [config.releaseDir],
                patterns: {
                    html: [
                        [
                            new RegExp('<%- staticBase %>\/(([^"\']+))', 'gm'),
                            'view match',
                            function(m) {
                                return m.replace('<%- staticBase %>', '');
                            },
                            function(m) {
                                return m;
                            }
                        ]
                    ]
                },
                js: [
                    [
                        new RegExp('<%- staticBase %>\/(([^"\']+))', 'gm'),
                        'js match',
                        function(m) {
                            return m.replace('<%- staticBase %>', '');
                        },
                        function(m) {
                            return m;
                        }
                    ]
                ],
                css: [
                    [
                        new RegExp('<%- staticBase %>\/(([^"\']+))', 'gm'),
                        'css match',
                        function(m) {
                            return m.replace('<%- staticBase %>', '');
                        },
                        function(m) {
                            return m;
                        }
                    ]
                ]
            }
        },
        template: templateConfig,
        uglify: {
            options: {
                banner: '/*! js <%= product %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            min: {
                expand: true,
                cwd: config.releaseDir,
                src: '**/*.js',
                dest: config.releaseDir
            } //ext: '.min.css' 生成的文件都使用.min.css替换原有扩展名，生成文件存放于dest指定的目录中//['*.css', '!*.min.css']
        },
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true,
                minifyJS: true,
                minifyCSS: true
            },
            min: {
                expand: true,
                cwd: config.releaseDir,
                src: ['**/*.html', '**/*.php'],
                dest: config.releaseDir
            }
        },
        compress: {
            main: {
                options: {
                    archive: config.compressDir + '/react.zip'
                },
                files: [{
                    expand: true,
                    cwd: config.releaseDir,
                    src: ['**'],
                    dest: ''
                }]
            },
            server: {
                options: {
                    archive: config.compressDir + '/react.zip'
                },
                files: [{
                    expand: true,
                    cwd: config.releaseDir + '/react/',
                    src: ['**/*.php', '**/*.html'],
                    dest: ''
                }]
            },
            static: {
                options: {
                    archive: config.compressDir + '/static.zip'
                },
                files: [{
                    expand: true,
                    cwd: config.releaseDir + '/static/',
                    src: ['**/*.css', '**/*.js', '**/images/**/*.*', '**/*.css'],
                    dest: ''
                }]
            }
        },
        cssmin: {
            options: {
                banner: '/*! css <%= product %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            min: {
                expand: true,
                cwd: config.releaseDir,
                src: '**/*.css',
                dest: config.releaseDir
            }
        },
        watch: {
            options: {
                livereload: true
            },
            local: {
                files: [path.join(config.srcDir, 'src') + '/**'],
                //tasks: ['clean', 'copy:main', 'component', 'transport', 'concat', 'filerev', 'concat_seajs', 'usemin', 'template:local']
                tasks: ['clean', 'copy:main','component', 'template:local','concat']

                //grunt.registerTask('local', ['clean', 'copy:main', 'component', 'concat', 'template:local','watch:local','uglify:min', 'cssmin:min', 'htmlmin:min', 'filerev',]);
            }
        }
    });
     grunt.loadNpmTasks('grunt-concat-seajs');
     grunt.loadNpmTasks('grunt-component');
     grunt.loadNpmTasks('grunt-contrib-uglify');
     grunt.loadNpmTasks('grunt-contrib-cssmin');
     grunt.loadNpmTasks('grunt-contrib-htmlmin');
     grunt.loadNpmTasks('grunt-template');
     grunt.loadNpmTasks("grunt-zip");
     grunt.loadNpmTasks('grunt-contrib-copy');
     grunt.loadNpmTasks('grunt-contrib-concat');
     grunt.loadNpmTasks('grunt-contrib-compress');
     grunt.loadNpmTasks('grunt-contrib-clean');
     grunt.loadNpmTasks('grunt-contrib-watch');

     //for <%= product %> seajs
     grunt.loadNpmTasks('grunt-filerev');
     grunt.loadNpmTasks('grunt-cmd-transport');
     grunt.loadNpmTasks('grunt-usemin');
};
