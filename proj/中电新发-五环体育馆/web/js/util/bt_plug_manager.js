//最新版本：2018.01.08

var bt_is_mobile = false;

//创建插件类
function Plug () {
	this.js_name = 'js_name';								//插件文件名，默认为'js_name'
	this.plug_name = 'plug_name';							//插件名，默认为'plug_name'
	this.plug_icon = 'ali-icon-yingyongguanli';				//插件图标，默认为'ali-icon-yingyongguanli'
	this.plug_commands = [];								//插件功能集合，默认为空
	this.plug_isOnce = false;								//插件是否是一次性点击的插件，默认为false
	this.plug_isOnMobile = false;							//插件是否可在移动设备上使用，默认为false
	this.plug_needToPay = false;							//插件是否需要付费以继续使用，默认为false
	this.plug_commandOnly = false;							//插件内功能是否保持唯一开启，默认为false
	this.plug_activate = function () {};					//插件激活方法
	this.plug_deactivate = function () {};					//插件注销方法
	this.command_activate = function (command_id) {};		//功能开启方法，参数command_id对应功能类中的command_id字段
	this.command_deactivate = function (command_id) {};		//功能关闭方法，参数command_id对应功能类中的command_id字段
}

//创建功能类
function Command (command_name, command_id, command_isActive, command_isOnce, command_imgUrl) {
	this.command_name = command_name;						//（string） 功能名
	this.command_id = command_id;							//（string） 功能唯一ID，对应插件类中的参数command_id
	this.command_isActive = command_isActive;				//（boolean）是否激活
	this.command_isOnce = command_isOnce;					//（boolean）是否为一次性点击功能，如果为true，此种功能无关闭方法
	this.command_imgUrl = command_imgUrl;					//功能图标url: 'xxx/xxxx.png'
}

//将"bt_PlugManager"声明为全局对象
var bt_PlugManager =
new Vue({
	el: '.plugManager',
	data:{
		previous_js_name: '',  				//储存上次点击的插件js名
		previous_plug_activate: '',			//储存上次点击的插件激活方法
		previous_plug_deactivate: '',		//储存上次点击的插件注销方法
		previous_command: '',				//储存上次点击的功能
		previous_command_activate: '',		//储存上次点击的功能的开启方法
		previous_command_deactivate: '',	//储存上次点击的功能的关闭方法
		all_command_deactivates: [],		//储存所有已开启功能的关闭方法
		show: false,						//移动设备的插件管理器显示
		setTimenOut: null,					//定时器
		
		//设备检测
		mobileDevice: navigator.userAgent.match(/Android/i)	
			|| navigator.userAgent.match(/webOS/i)
			|| navigator.userAgent.match(/iPhone/i)
			|| navigator.userAgent.match(/iPad/i)
			|| navigator.userAgent.match(/iPod/i)
			|| navigator.userAgent.match(/BlackBerry/i)
			|| navigator.userAgent.match(/Windows Phone/i),
			
		//原'bt_plug.js'内容
		plugins: [],
		topics: {},
		events: {},
		//bind func
		bind: function (topic, func) {	
			if (!bt_PlugManager.topics[topic]) {
				bt_PlugManager.topics[topic] = [];
			}
			let token = topic;
			bt_PlugManager.topics[topic].push({
				token: token,
				func: func
			});
			return token;
		},
		// trigger func
		trigger: function (topic, args) {	
			if (!bt_PlugManager.topics[topic]) {
				return false;
			}
			setTimeout(function () {
				let listener = bt_PlugManager.topics[topic],
					len = listener ? listener.length: 0;
				while (len--) {
					listener[len].func(topic, args);
				}
			}, 0);
			return true; 
		},
		triggerAll: function (args) {
			for(let topic in bt_PlugManager.topics) {
				bt_PlugManager.trigger(topic,args);
			}
		},
		//remove func
		removeOne: function (token) {	
			for(let m in bt_PlugManager.topics) {
				if (topics[m]) {
					for(let i = 0, j = bt_PlugManager.topics[m].length; i < j; i++) {
						if (bt_PlugManager.topics[m][i].token === token) {
							bt_PlugManager.topics[m].splice(i, 1);
							return token;
						}
					}
				}
			}
			return false;
		},
		remove: function (token) {
			while (true) {
				let sign = bt_PlugManager.removeOne(token);
				if (!sign) break; 
			}
		},
		removeAll: function () {
			for(let top in bt_PlugManager.topics) {
				bt_PlugManager.topics[top].splice(0,bt_PlugManager.topics[top].length);
			}
		},
		bt_DefaultGUIAction: {
			panBegan: function (x, y) {
				let script = "Render\\CameraControl\\PanBegan " + x + "\t" + y + ";";
				BT_BodyExecuteScript(g_Body, script, 0);
			},
			pan: function (x, y) {
				let script = "Render\\CameraControl\\Pan " + x + "\t" + y + ";";
				BT_BodyExecuteScript(g_Body, script, 0);
			},
			pinchBegan: function () {
				BT_BodyExecuteScript(g_Body, "Render\\CameraControl\\PinchBegan;");
			},
			pinch: function (scale) {
				let script = "Render\\CameraControl\\Pinch " + scale + ";";
				BT_BodyExecuteScript(g_Body, script, 0);
			},
			rotateBegan: function (x, y) {
				let script = "Render\\CameraControl\\RotateBegan " + x + " " + y + ";";
				BT_BodyExecuteScript(g_Body, script, 0);
			},
			rotate: function (x, y) {
				let script = "Render\\CameraControl\\Rotate " + x + "\t" + y + ";";
				BT_BodyExecuteScript(g_Body, script, 0);
			},
			transformTo: function (x, y) {
				let script = "Render\\CameraControl\\TransformTo " + x + "\t" + y + ";";
		
				let bt_log = BT_LogCreate();
				BT_BodyExecuteScript(g_Body, script, bt_log);
		
				let log_count = BT_LogGetCount(bt_log);
				if (log_count > 0) {
					let log_str = Module.Pointer_stringify(BT_LogGetLog(0, bt_log));
					console.log(log_str);
				}
				BT_LogClearAll(bt_log);
				BT_LogRelease(bt_log);
			},
		
			km: {
				onMouseButtonDown: function (button_id, x, y) {
					let script = "GUIEvent.KM.OnMouseButtonDown " + button_id + " " + x + " " + y + ";";
					BT_BodyExecuteScript(g_Body, script, 0);
				},
		
				onMouseButtonUp: function (button_id, x, y) {
					let script = "GUIEvent.KM.OnMouseButtonUp " + button_id + " " + x + " " + y + ";";
					BT_BodyExecuteScript(g_Body, script, 0);
				},
		
				onMouseMove: function (x, y) {
					let script = "GUIEvent.KM.OnMouseMove " + x + " " + y + ";";
					BT_BodyExecuteScript(g_Body, script, 0);
				},
		
				onMouseClick: function (button_id, x, y) {
					let script = "GUIEvent.KM.OnMouseClick " + button_id + " " + x + " " + y + ";";
					BT_BodyExecuteScript(g_Body, script, 0);
				},
		
				onMouseDbClick: function (button_id, x, y) {
					let script = "GUIEvent.KM.OnMouseDbClick " + button_id + " " + x + " " + y + ";";
					BT_BodyExecuteScript(g_Body, script, 0);
				},
		
				onMouseWheel: function (delta, x, y) {
					if (delta > 0) {
						let script = "GUIEvent.KM.OnMouseWheel 1.06 + " + x + " " + y + ";";
						BT_BodyExecuteScript(g_Body, script, 0);
					}
					else {
						let script = "GUIEvent.KM.OnMouseWheel 0.9434 + " + x + " " + y + ";";
						BT_BodyExecuteScript(g_Body, script, 0);
					}
				},
				
				onKeyDown: function (key) {
					let script = "GUIEvent.KM.OnKeyDown " + key + ";";
					BT_BodyExecuteScript(g_Body, script, 0);
				},
				
				onKeyUp: function (key) {
					let script = "GUIEvent.KM.OnKeyUp " + key + ";";
					BT_BodyExecuteScript(g_Body, script, 0);
				}
			}, //KM
		},
		km: {
			onMouseButtonDown(button_id, x, y) {
				let ep = [];
				ep[0] = 'GUIEvent\\KM\\OnMouseButtonDown';
				ep[1] = button_id;
				ep[2] = x;
				ep[3] = y;
				if (bt_PlugManager.on_BTEvent(ep)) return true;
				bt_PlugManager.bt_DefaultGUIAction.km.onMouseButtonDown(button_id, x, y);
			},
			onMouseButtonUp(button_id, x, y) {
				let ep = [];
				ep[0] = 'GUIEvent\\KM\\OnMouseButtonUp';
				ep[1] = button_id;
				ep[2] = x;
				ep[3] = y;
				if (bt_PlugManager.on_BTEvent(ep)) return true;
				bt_PlugManager.bt_DefaultGUIAction.km.onMouseButtonUp(button_id, x, y);
			},
			onMouseMove(x, y) {
				let ep = [];
				ep[0] = 'GUIEvent\\KM\\OnMouseMove';
				ep[1] = x;
				ep[2] = y;
				if (bt_PlugManager.on_BTEvent(ep)) return true;
				bt_PlugManager.bt_DefaultGUIAction.km.onMouseMove(x, y);
			},
			onMouseClick(button_id, x, y) {
				let ep = [];
				ep[0] = 'GUIEvent\\KM\\OnMouseClick';
				ep[1] = button_id;
				ep[2] = x;
				ep[3] = y;
				if (bt_PlugManager.on_BTEvent(ep)) return true;
				bt_PlugManager.bt_DefaultGUIAction.km.onMouseClick(button_id, x, y);
			},
			onMouseDbClick(button_id, x, y) {
				let ep = [];
				ep[0] = 'GUIEvent\\KM\\OnMouseDbClick';
				ep[1] = button_id;
				ep[2] = x;
				ep[3] = y;
				if (bt_PlugManager.on_BTEvent(ep)) return true;
				bt_PlugManager.bt_DefaultGUIAction.km.onMouseDbClick(button_id, x, y);
			},
			onMouseWheel(delta, x, y) {
				let ep = [];
				ep[0] = 'GUIEvent\\KM\\OnMouseWheel';
				ep[1] = delta;
				ep[2] = x;
				ep[3] = y;
				if (bt_PlugManager.on_BTEvent(ep)) return true;
				bt_PlugManager.bt_DefaultGUIAction.km.onMouseWheel(delta, x, y);
			},
			onKeyDown(key) {
				let ep = [];
				ep[0] = 'GUIEvent\\KM\\OnKeyDown';
				ep[1] = key;
				if (bt_PlugManager.on_BTEvent(ep)) return true;
				bt_PlugManager.bt_DefaultGUIAction.km.onKeyDown(key);			
			},
			onKeyUp(key) {
				let ep = [];
				ep[0] = 'GUIEvent\\KM\\OnKeyUp';
				ep[1] = key;
				if (bt_PlugManager.on_BTEvent(ep)) return true;
				bt_PlugManager.bt_DefaultGUIAction.km.onKeyUp(key);			
			}
		}, //KM
		addEventListener: function (e, f) {
			if (!bt_PlugManager.events[e]) {
				bt_PlugManager.events[e] = {};
			}
			let event = bt_PlugManager.events[e];
			if (!event[f]) {
				event[f] = f;
			}
		},	
		removeEventListener: function (e, f) {
			if (!bt_PlugManager.events[e]) return;
			let event = bt_PlugManager.events[e];
			if (!event[f]) return;
			delete event[f];
		},
		on_BTEvent: function (e) {
			let event_param = [];
			for (let i = 1; i < e.length; i++) {
				event_param[i - 1] = e[i];
			}
			let event = bt_PlugManager.events[e[0]];
			if (!event) return;
			for (let ef in event) {
				if (event[ef](event_param)) {
					return true;
				}
			}
		}
	},
	methods: {
		//插件接口：insert_plug() {}；参数：( 插件对象 )
		insert_plug(Plug) {
			let that = this;
			//声明变量
			let js_name = Plug.js_name;
			let plug_name = Plug.plug_name;
			let plug_icon = Plug.plug_icon;
			let plug_commands = Plug.plug_commands;
			let plug_isOnce = Plug.plug_isOnce;
			let plug_isOnMobile = Plug.plug_isOnMobile;
			let plug_needToPay = Plug.plug_needToPay;
			let plug_commandOnly = Plug.plug_commandOnly;
			let plug_activate = Plug.plug_activate;
			let plug_deactivate = Plug.plug_deactivate;
			
			//如果引入插件，显示插件栏
			$('.plugManager').css('display', 'block');
			//判断插件内是否有功能
			if (plug_commands.length > 0) {	
				//如果插件内有功能，添加插件按钮和下拉图标
				$('.plug_box').append("<li class='plug_button plug_btn_" + js_name + "'><div class='iconfont " + plug_icon + "'></div><div class='plug_name'>" + plug_name + "</div><div class='el-icon el-icon-arrow-down'></div></li>");
			}else{	
				//如果插件内无功能，添加插件按钮
				$('.plug_box').append("<li class='plug_button plug_btn_" + js_name + "'><div class='iconfont " + plug_icon + "'></div><div class='plug_name'>" + plug_name + "</div></li>");
			}
			//添加插件按钮样式
			that.plug_buttonStyle(js_name, plug_name, plug_isOnce, plug_isOnMobile, plug_needToPay);
			//绑定插件按钮点击事件
			that.activate(js_name, plug_name, plug_commands, plug_isOnce, plug_isOnMobile, plug_needToPay, plug_commandOnly, plug_activate, plug_deactivate);
		},
		//绑定插件按钮的点击事件（激活插件）
		activate(js_name, plug_name, plug_commands, plug_isOnce, plug_isOnMobile, plug_needToPay, plug_commandOnly, plug_activate, plug_deactivate) {
			let that = this;
			//判断如果插件内有功能
			if (plug_commands.length > 0) {
				//则添加插件内的功能栏
				$('.plug_btn_' + js_name).after("<ul class='command_box cd_box_" + js_name + "'></ul>");
				//添加功能栏样式
				$('.command_box').css({
					'display': 'none',
					'height': 'auto',
					'background-color': '#545c64',
					'background-color': 'rgba(0, 0, 0, 0)'
				});
				//遍历功能按钮
				for (let i = 0; i < plug_commands.length; i++) {
					//如果功能有图标
					if (plug_commands[i].command_imgUrl !== undefined) {
						//添加功能按钮
						$('.cd_box_' + js_name).append("<li class='cd-button cd_btns_" + js_name + " cd_btn_" + js_name + i + " type='button'><img src='" + plug_commands[i].command_imgUrl + "' />" + plug_commands[i].command_name + "</li>");
						//添加图标按钮样式
						$('.cd_btn_' + js_name + i + ' img').css({
							'position': 'relative',
							'height': '20px',
							'line-height': '20px',
							'margin-right': '5px',
							'top': '0px',
						})
						//添加功能按钮样式
						$('.cd_btn_' + js_name + i).css({
							'list-style': 'none',
							'text-indent': '10px',
							'color': 'white',
							'background-color': 'white',
							'background-color': 'rgba(0, 0, 0, 0.1)',
							'height': '60px',
							'width': '190px',
							'border': 'none',
							'line-height': '60px',
							'outline': 'none',
							'cursor': 'pointer',
							'transition': 'background-color 0.4s, color 0.3s'
						});
					} else {
						//添加功能按钮
						$('.cd_box_' + js_name).append("<li class='cd-button cd_btns_" + js_name + " cd_btn_" + js_name + i + " type='button'>" + plug_commands[i].command_name + "</li>");
						//添加功能按钮样式
						$('.cd_btn_' + js_name + i).css({
							'list-style': 'none',
							'text-indent': '30px',
							'color': 'white',
							'background-color': 'white',
							'background-color': 'rgba(0, 0, 0, 0.1)',
							'height': '60px',
							'width': '190px',
							'border': 'none',
							'line-height': '60px',
							'outline': 'none',
							'cursor': 'pointer',
							'transition': 'background-color 0.4s, color 0.3s'
						});
					}
					//判断如果当前设备为PC端
					if (!that.mobileDevice) {	
						//绑定鼠标动作的样式
						$('.cd_btn_' + js_name + i).on({
							//绑定鼠标进入的样式
							mouseenter: function () {
								$('.cd_btn_' + js_name + i).css({
									'background-color': 'rgba(0, 0, 0, 0.3)'
								})
							},
							//绑定鼠标离开的样式
							mouseleave: function () {
								$('.cd_btn_' + js_name + i).css({
									'background-color': 'rgba(0, 0, 0, 0.1)'
								})
							}
						})
					};
					//判断该功能如果是一次性点击功能
					if (plug_commands[i].command_isOnce === true) {
						//鼠标左键按下
						$('.cd_btn_' + js_name + i).mousedown(function () {
							$('.cd_btn_' + js_name + i).css({
								'color': 'gold',
								'border-left': '3px solid gold',
								'background-color': 'rgba(0, 0, 0, 0.3)'
							});
						});
						//鼠标左键抬起
						$('.cd_btn_' + js_name + i).mouseup(function () {
							$('.cd_btn_' + js_name + i).css({
								'color': 'white',
								'border': 'none',
								'background-color': 'rgba(0, 0, 0, 0.1)'
							});
						});
						//功能按钮点击事件
						$('.cd_btn_' + js_name + i).click(function () {
							//使用功能（而非开启功能，为一次性点击事件）
							eval(js_name + '.command_activate(' + js_name + '.plug_commands[' + i + '].command_id)'); 
						});
					//判断该功能不是一次性点击功能
					} else {
						//判断如果插件内功能保持唯一开启
						if (plug_commandOnly === true) {	
							//鼠标左键按下
							$('.cd_btn_' + js_name + i).mousedown(function () {
								$('.cd_btn_' + js_name + i).css({
									'border-left': '3px solid gold'
								});
							});
							//鼠标左键抬起
							$('.cd_btn_' + js_name + i).mouseup(function () {
								$('.cd_btn_' + js_name + i).css({
									'border': 'none'
								});
							});
							//功能按钮点击事件
							$('.cd_btn_' + js_name + i).click(function () {
								//判断如果该功能未开启
								if (plug_commands[i].command_isActive === false) { 
									//将该功能开启状态更改为true
									plug_commands[i].command_isActive = true;
									//判断如果当前有已激活的功能
									if (that.previous_command_deactivate !== '') {
										//重置所有功能按钮样式
										$('.cd-button').css({	
											'color': 'white'
										});
										$('.cd_btn_' + js_name + i).css({
											'color': 'gold'
										})
										//关闭当前已激活的功能
										eval(that.previous_command_deactivate);
										//将当前已激活功能的isActive状态更改为false
										that.previous_command.command_isActive = false;	
										//开启当前点击的功能	
										eval(js_name + '.command_activate(' + js_name + '.plug_commands[' + i + '].command_id)'); 
									}else{
										$('.cd_btn_' + js_name + i).css({
											'color': 'gold'
										})
										//开启当前点击的功能
										eval(js_name + '.command_activate(' + js_name + '.plug_commands[' + i + '].command_id)'); 	
									}
									//将该功能的关闭方法放入all_command_deactivates[]
									that.all_command_deactivates.push(js_name + '.command_deactivate(' + js_name + '.plug_commands[' + i + '].command_id)'); 	
									//将该功能的关闭方法赋值给"previous_command_deactivate"
									that.previous_command_deactivate=js_name + '.command_deactivate(' + js_name + '.plug_commands[' + i + '].command_id)';
									//将该功赋值给"previous_command"
									that.previous_command=plug_commands[i];
								} else { 
									//如果该功能已开启,将该功能开启状态更改为false
									plug_commands[i].command_isActive = false;
									$('.cd_btn_' + js_name + i).css({
										'color': 'white'
									});
									//关闭功能
									eval(js_name + '.command_deactivate(' + js_name + '.plug_commands[' + i + '].command_id)'); 
									//从all_command_deactivates[]移除该功能的关闭方法
									that.all_command_deactivates.remove(js_name + '.command_deactivate(' + js_name + '.plug_commands[' + i + '].command_id)'); 
									//关闭功能后将"previous_command_deactivate"的值初始化
									that.previous_command_deactivate = '';	
									//关闭功能后将"previous_command"的值初始化
									that.previous_command = '';			
								}
							})
						}else{
							//鼠标左键按下
							$('.cd_btn_' + js_name + i).mousedown(function () {
								$('.cd_btn_' + js_name + i).css({
									'border-left': '3px solid gold'
								});
							});
							//鼠标左键抬起
							$('.cd_btn_' + js_name + i).mouseup(function () {
								$('.cd_btn_' + js_name + i).css({
									'border': 'none'
								});
							});
							//功能按钮点击事件
							$('.cd_btn_' + js_name + i).click(function () {
								//判断如果该功能未开启
								if (plug_commands[i].command_isActive === false) { 
									//将功能开启状态更改为true
									plug_commands[i].command_isActive = true;
									$('.cd_btn_' + js_name + i).css({
										'color': 'gold'
									})
									//开启功能
									eval(js_name + '.command_activate(' + js_name + '.plug_commands[' + i + '].command_id)'); 	
									//将该功能的关闭方法放入all_command_deactivates[]
									that.all_command_deactivates.push(js_name + '.command_deactivate(' + js_name + '.plug_commands[' + i + '].command_id)'); 
								} else { 
									//如果该功能已开启，将功能开启状态更改为false
									plug_commands[i].command_isActive = false;
									$('.cd_btn_' + js_name + i).css({
										'color': 'white'
									});
									//关闭功能
									eval(js_name + '.command_deactivate(' + js_name + '.plug_commands[' + i + '].command_id)'); 
									//从all_command_deactivates[]移除该功能的关闭方法
									that.all_command_deactivates.remove(js_name + '.command_deactivate(' + js_name + '.plug_commands[' + i + '].command_id)'); 
								}
							})
						}
					}
				}
			}
			//绑定插件按钮点击事件
			$('.plug_btn_' + js_name).click(function () {
				if ((plug_needToPay === true) || (that.mobileDevice && plug_isOnMobile === false)) {
					//1、如果是付费插件
					//2、如果是移动设备，且该插件不可用于移动设备
					return false;
				}else{
					//如果插件是一次性点击的插件
					if (plug_isOnce === true) {
						plug_activate();	
					} else {
						that.previous_js_name = js_name;
						let plug_btns = $('.plug_button');
						for (let i = 0; i < plug_btns.length; i++) {
							//当遍历到当前点击的插件时
							if ($(plug_btns[i]).html() === $('.plug_btn_' + js_name).html()) { 
								$(plug_btns[i]).off('mouseenter').off('mouseleave');
								$(plug_btns[i]).css({
									'color': 'gold',
									'background-color': 'rgba(0, 0, 0, 0.5)',
									'border-left': '3px solid gold'
								})
								$('.plug_btn_' + js_name + ' .iconfont').css({
									'width': '52px',
									'text-indent': '18px'
								})
							} else { 
								//遍历的非当前点击的插件，如果该插件可以点击
								if ($(plug_btns[i]).css('cursor') !== 'not-allowed') {
									$(plug_btns[i]).css({
										'color': 'white',
										'border-left': 'none',
										'width': '190px'
									});
									//判断如果当前设备为PC端
									if (!that.mobileDevice) { 
										$(plug_btns[i]).on({
											mouseenter: function () {
												$(plug_btns[i]).css({
													'background-color': 'rgba(0, 0, 0, 0.7)'
												});
											},
											mouseleave: function () {
												$(plug_btns[i]).css({
													'background-color': 'rgba(0, 0, 0, 0.5)'
												})
											}
										})
									}
								}
							}
						};
						//判断如果当前有已激活插件，且点击的是同一插件
						if (that.previous_plug_activate !== '' && that.previous_plug_activate === plug_activate) {	
							//判断如果当前已开启的功能数量大于0
							if (that.all_command_deactivates.length > 0) { 
								//关闭所有已开启的功能
								for(let i = 0; i < that.all_command_deactivates.length; i++) { 
									eval(that.all_command_deactivates[i])
								}
								//重置所有功能的isActive属性，恢复到未点击状态
								for(let i = 0; i < plug_commands.length; i++) { 
									plug_commands[i].command_isActive = false;
								}
								//重置所有功能按钮样式
								$('.cd-button').css({	
									'color': 'white'
								})
								//关闭功能后将"all_command_deactivates"的值初始化
								that.all_command_deactivates = []; 		
								//关闭功能后将"previous_command_deactivate"的值初始化
								that.previous_command_deactivate = '';	
								//关闭功能后将"previous_command"的值初始化
								that.previous_command = '';				
							};
							//注销当前已激活的插件
							that.previous_plug_deactivate(); 	
							//注销插件后将按钮的样式重置，恢复初始状态
							for (let i = 0; i < plug_btns.length; i++) {	
								//遍历的非当前点击的插件
								if ($(plug_btns[i]).css('cursor') !== 'not-allowed') {
									$(plug_btns[i]).css({
										'color': 'white',
										'border-left': 'none',
										'width': '190px'
									})
								}
							};
							$('.plug_btn_' + js_name + ' .iconfont').css({
								'width': '55px',
								'text-indent': '21px'
							})
							$('.plug_btn_' + js_name + ' .el-icon').removeClass('el-icon-arrow-up').addClass('el-icon-arrow-down');
							//如果是在PC端
							if (!that.mobileDevice) {
								$('.plug_btn_' + js_name).on({
									mouseenter: function () {
										$('.plug_btn_' + js_name).css({
											'background-color': 'rgba(0, 0, 0, 0.7)'
										});
									},
									mouseleave: function () {
										$('.plug_btn_' + js_name).css({
											'background-color': 'rgba(0, 0, 0, 0.5)'
										});
									}
								});	
							};
							//收起功能栏
							$('.cd_box_' + js_name).slideUp(200);	
							//注销插件后将"previous_plug_activate"的值初始化
							that.previous_plug_activate = ''; 				
							//注销插件后将"previous_plug_deactivate"的值初始化
							that.previous_plug_deactivate = ''; 	
							//将"previous_js_name"的值初始化
							that.previous_js_name = '';	
						}else{
							//插件间切换运行逻辑
							if (that.previous_plug_activate=='') {
								//判断如果当前无已激活插件，重置所有功能的isActive属性，恢复到未点击状态
								for(let i = 0; i < plug_commands.length; i++) {
									plug_commands[i].command_isActive=false; 
								};
								//激活点击的插件
								plug_activate();
								//将当前点击的插件的激活方法名赋值给"previous_plug_activate"
								that.previous_plug_activate = plug_activate;
								//将当前点击的插件的注销方法名赋值给"previous_plug_deactivate"
								that.previous_plug_deactivate = plug_deactivate;
								//将当前点击的插件名赋值给"previous_js_name"
								that.previous_js_name = js_name;	
							}else{	
								//判断如果当前有已激活插件，如果当前已开启的功能数量大于0
								if (that.all_command_deactivates.length > 0) {	
									//关闭所有已开启的功能
									for(let i = 0; i < that.all_command_deactivates.length; i++) {	
										eval(that.all_command_deactivates[i])
									};
									//关闭功能后将"deactFunctions"的值初始化
									that.all_command_deactivates = [];
									//关闭功能后将"previous_command_deactivate"的值初始化
									that.previous_command_deactivate = '';	
									//关闭功能后将"previous_command"的值初始化
									that.previous_command = '';	
									//重置所有功能按钮样式
									$('.cd-button').css({	
										'color': 'white'
									});
								};
								//重置所有功能的isActive属性，恢复到未点击状态
								for(let i = 0; i < plug_commands.length; i++) {	
									plug_commands[i].command_isActive = false; 
								};
								//注销当前已激活的插件，对应的是上一次点击的插件
								that.previous_plug_deactivate();
								//激活点击的插件
								plug_activate();					
								//将当前点击的插件的激活方法名赋值给"previous_plug_activate"
								that.previous_plug_activate = plug_activate;	
								//将当前点击的插件的注销方法名赋值给"previous_plug_deactivate"
								that.previous_plug_deactivate = plug_deactivate;	
							};
							//重置所有插件按钮图标样式
							let iconfonct = $('.plug_button .iconfont');
							for (let i = 0; i < iconfonct.length; i++) {
								$(iconfonct[i]).css({
									'width': '55px',
									'text-indent': '21px'
								});
							};
							let el_icon = $('.plug_button .el-icon');
							for (let i = 0; i < el_icon.length; i++) {
								$(el_icon[i]).removeClass('el-icon-arrow-up').addClass('el-icon-arrow-down');
							};
							//更新当前点击的插件按钮图标样式
							$('.plug_btn_' + js_name + ' .iconfont').css({
								'width': '52px',
								'text-indent': '18px'
							});
							$('.plug_btn_' + js_name + ' .el-icon').removeClass('el-icon-arrow-down').addClass('el-icon-arrow-up');
							//收起已展开的功能栏
							$('.command_box').slideUp(200);		
							//展开当前点击的插件的功能栏
							$('.cd_box_' + js_name).slideDown(200);	
							//将当前点击的插件名赋值给"previous_js_name"
							that.previous_js_name = js_name;		
						}
					}
				}
			})
		},
		//插件按钮样式
		plug_buttonStyle(js_name, plug_name, plug_isOnce, plug_isOnMobile, plug_needToPay) {
			let that = this;
			if ((plug_needToPay === true) || (that.mobileDevice && plug_isOnMobile === false)) {
				//1、如果是付费插件
				//2、如果是移动设备，且该插件不可用于移动设备
				$('.plug_btn_' + js_name).css({
					'overflow': 'hidden',
					'white-space': 'nowrap',
					'text-overflow': 'ellipsis',
					'list-style': 'none',
					'vertical-align': 'bottom',
					'color': '#7e848a',
					'background-color': 'white',
					'background-color': 'rgba(0, 0, 0, 0.5)',
					'height': '60px',
					'width': '190px',
					'border': 'none',
					'line-height': '60px',
					'outline': 'none',
					'cursor': 'not-allowed',
					'transition': 'background-color 0.4s, color 0.3s'
				});
			}else{	
				//判断如果该插件是免费使用插件
				$('.plug_btn_' + js_name).css({
					'overflow': 'hidden',
					'white-space': 'nowrap',
					'text-overflow': 'ellipsis',
					'list-style': 'none',
					'vertical-align': 'bottom',
					'color': 'white',
					'background-color': 'white',
					'background-color': 'rgba(0, 0, 0, 0.5)',
					'height': '60px',
					'width': '190px',
					'border': 'none',
					'line-height': '60px',
					'outline': 'none',
					'cursor': 'pointer',
					'transition': 'background-color 0.4s, color 0.3s'
				});
				//判断如果是在PC端
				if (!that.mobileDevice) {	
					//绑定插件按钮的鼠标动作样式
					$('.plug_btn_' + js_name).on({
						//绑定鼠标进入时的样式
						mouseenter: function () {
							$('.plug_btn_' + js_name).css({
								'background-color': 'rgba(0, 0, 0, 0.7)'
							});
						},
						//绑定鼠标离开时的样式
						mouseleave: function () {
							$('.plug_btn_' + js_name).css({
								'background-color': 'rgba(0, 0, 0, 0.5)'
							});
						}
					});
				};
				//如果该插件是一次性点击的插件
				if (plug_isOnce === true) { 
					//鼠标左键按下
					$('.plug_btn_' + js_name).mousedown(function () {
						$('.plug_btn_' + js_name).css({
							'color': 'gold',
							'border-left': '3px solid gold',
							'background-color': 'rgba(0, 0, 0, 0.7)'
						});
					});
					//鼠标左键抬起
					$('.plug_btn_' + js_name).mouseup(function () {
						$('.plug_btn_' + js_name).css({
							'color': 'white',
							'border': 'none',
							'background-color': 'rgba(0, 0, 0, 0.5)'
						});
					});
				}
			};
			//如果插件名称过长，气泡提示插件名称
			$('.plug_btn_' + js_name + ' .plug_name').map(function () {
				if (this.offsetWidth < this.scrollWidth) {
					$(this).html("<Tooltip trigger='hover' title='" + plug_name + "'><div class='tooltipName'>" + plug_name + "</div></Tooltip>");
					$('.tooltipName').css({
						'overflow': 'hidden',
						'text-overflow': 'ellipsis'
					})
				}
			})
		},
		//更改插件按钮显示的中文名
		change_jsName_CN (js_name, oldName, newName) {
			let that = this;
			//遍历所有插件按钮
			let plug_btns = $('.plug_name');
			for (let i = 0; i < plug_btns.length; i++) {
				//遍历到要更改的插件时
				if ($(plug_btns[i]).html() === oldName) {
					//更改插件名
					$(plug_btns[i]).html(newName);
				}
			}
		},
		//更改功能按钮显示的中文名
		change_commandName_CN (js_name, oldName, newName) {
			let that = this;
			//遍历功能按钮
			let command_btns = $('.cd_btns_' + js_name);
			for (let i = 0; i < command_btns.length; i++) {
				//遍历到要更改的插件时
				if ($(command_btns[i]).html() === oldName) {
					//更改插件名
					$(command_btns[i]).html(newName);
				}
			}
		},
		//获取屏幕上的点坐标
		getPointOnCanvas(canvas, x, y) {
			let bbox = canvas.getBoundingClientRect();
			return {
				x: x - bbox.left * (canvas.width / bbox.width),
				y: y - bbox.top * (canvas.height / bbox.height)
			};
		},
		//插件管理器UI初始化
		plugManager_UI_init() {
			let that = this;
			//利用原型添加删除数组中指定元素的方法
			Array.prototype.indexOf = function (val) {
				for (let i = 0; i < this.length; i++) {
					if (this[i] === val) return i;
				};
				return -1;
			};
			Array.prototype.remove = function (val) {
				let index = this.indexOf(val);
				if (index > -1) {
					this.splice(index, 1);
				};
			};
			//设备检测
			if (that.mobileDevice) {	//判断如果是移动设备
				//添加插件管理器动画效果
				touch.on('.plugManager', 'touchend', function (ev) {
					$('.plugManager').animate({'width': '190px'},300);
					$('.cd_box_' + that.previous_js_name).slideDown(300);
					if (that.show === false) {
						that.show = true;
						ev.preventDefault();
					} 
				});
				touch.on('#canvasgl', 'touchstart', function (ev) {
					$('.plugManager').animate({'width': '55'},300);
					$('.cd_box_' + that.previous_js_name).slideUp(300);
					that.show = false;
					ev.preventDefault();
				});
				//如果是移动设备，不显示相机的信息
				$(".cameraInfo").css("display","none"); 
			} else {
				/*$('.plugManager').on({
					mouseenter: function () {
						$('.plugManager').animate({'width': '190px'},300);
						$('.cd_box_' + that.previous_js_name).slideDown(300);
						clearTimeout(that.setTimenOut);
					},
					mouseleave: function () {
						that.setTimenOut = setTimeout(function () {
							$('.plugManager').animate({'width': '55'},300);
							$('.cd_box_' + that.previous_js_name).slideUp(300);
						}, 500)
					}
				});*/
			}
		},
		//GUI控制初始化
		canvasgl_GUI_init() {
			//设备类型标识
			let browser = {
				versions: function () {
					let u = navigator.userAgent, app = navigator.appVersion;
					return {
						Chrome: u.indexOf('Chrome') > -1,
						MSIE: u.indexOf('Trident') > -1 || u.indexOf('MSIE') > -1,
						OPR: u.indexOf('Presto') > -1 || u.indexOf('OPR') > -1,
						webKit: u.indexOf('AppleWebKit') > -1 || u.indexOf('Safari') > -1,
						gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
						mobile: !!u.match(/AppleWebKit.*Mobile.*/),
						ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
						android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
						iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
						iPad: u.indexOf('iPad') > -1,
						webApp: u.indexOf('Safari') == -1,
						Firefox: u.indexOf('Firefox') > -1
					}
				}()
			}
			//判断如果是移动设备
			if (browser.versions.mobile || browser.versions.android || browser.versions.iPhone || browser.versions.iPad) {
				bt_is_mobile = true;
				let action = '';		//储存手势行为名称
				let buttonID = '';		//储存模拟的鼠标按键ID
				let trigger = null;		//计时器
				//初始化数据
				touch.config = {
					tap: true,
					doubleTap: true,
					hold: false,
					holdTime: 650,
					swipe: true,
					swipTime: 300,
					swipMinDistance: 18,
					swipFactor: 0.1,
					drag: true,
					pinch: true
				};
				
				//手指刚接触屏幕时
				touch.on('#canvasgl', 'touchstart', function (ev) {
					if (ev.originEvent.touches.length == 1) {	//判断如果只有一根手指接触屏幕
						trigger = setTimeout(function () {
							buttonID = 0;
						},15)	//间隔15毫秒最流畅
						let loc = bt_PlugManager.getPointOnCanvas(ev.target, ev.originEvent.changedTouches[0].clientX, ev.originEvent.changedTouches[0].clientY);
						bt_PlugManager.km.onMouseButtonDown(buttonID, parseInt(loc.x), parseInt(loc.y));
					} else {	//判断如果有两根或两根以上的手指接触屏幕
						clearTimeout(trigger);	//清除定时器
						action = 'fingers';		//更新手势为多指
						buttonID = '';			//重置"buttonID"
					}
					ev.preventDefault();
				});
				//手指离开屏幕时
				touch.on('#canvasgl', 'touchend', function (ev) {
					if (ev.originEvent.touches.length == 0) {
						let loc = bt_PlugManager.getPointOnCanvas(ev.target, ev.originEvent.changedTouches[0].clientX, ev.originEvent.changedTouches[0].clientY);
						bt_PlugManager.km.onMouseButtonUp(buttonID, parseInt(loc.x), parseInt(loc.y));
						action = '';
						buttonID = '';
					}
					ev.preventDefault();
				});
				//单击屏幕
				touch.on('#canvasgl', 'tap', function (ev) {
					if (ev.originEvent.changedTouches.length == 1) {
						let loc = bt_PlugManager.getPointOnCanvas(ev.target, ev.originEvent.changedTouches[0].clientX, ev.originEvent.changedTouches[0].clientY);
						bt_PlugManager.km.onMouseClick(0, parseInt(loc.x), parseInt(loc.y));
					};
					ev.preventDefault();
				});
				//双击屏幕
				touch.on('#canvasgl', 'doubletap', function (ev) {
					if (ev.originEvent.changedTouches.length == 1) {
						let loc = bt_PlugManager.getPointOnCanvas(ev.target, ev.originEvent.changedTouches[0].clientX, ev.originEvent.changedTouches[0].clientY);
						bt_PlugManager.km.onMouseDbClick(0, parseInt(loc.x), parseInt(loc.y));
					}
				});
				
				//拖动开始
				touch.on('#canvasgl', 'dragstart', function (ev) {
					if (ev.originEvent.changedTouches.length == 1) {
						let loc = bt_PlugManager.getPointOnCanvas(ev.target, ev.originEvent.changedTouches[0].clientX, ev.originEvent.changedTouches[0].clientY);
						bt_PlugManager.km.onMouseButtonDown(buttonID, parseInt(loc.x), parseInt(loc.y));
						action = 'drag';
					}
					ev.preventDefault();
				});
				//拖动手势
				touch.on('#canvasgl', 'drag', function (ev) {
					if (ev.originEvent.changedTouches.length == 1) {
						let loc = bt_PlugManager.getPointOnCanvas(ev.target, ev.originEvent.changedTouches[0].clientX, ev.originEvent.changedTouches[0].clientY);
						bt_PlugManager.km.onMouseMove(parseInt(loc.x), parseInt(loc.y));
						action = 'drag';
					}
					ev.preventDefault();
				});
				//拖动结束
				touch.on('#canvasgl', 'dragend', function (ev) {
					let loc = bt_PlugManager.getPointOnCanvas(ev.target, ev.originEvent.changedTouches[0].clientX, ev.originEvent.changedTouches[0].clientY);
					bt_PlugManager.km.onMouseButtonUp(buttonID, parseInt(loc.x), parseInt(loc.y));
					action = '';
				});
				
				//获取两点间距离绝对值
				function getDistance(x1, y1, x2, y2) {
					return Math.sqrt((Math.abs(x1 - x2)) * (Math.abs(x1 - x2)) + (Math.abs(y1 - y2)) * (Math.abs(y1 - y2)));
				};
				
				//缩放、旋转
				let ps_x1, ps_y1, ps_x2, ps_y2;
				touch.on('#canvasgl', 'pinch', function (ev) {
					let x1 = ev.originEvent.touches[0].clientX;
					let y1 = ev.originEvent.touches[0].clientY;
					let x2 = ev.originEvent.touches[1].clientX;
					let y2 = ev.originEvent.touches[1].clientY;
					if (action === 'fingers') {	//如果手势为多指操作
						action = 'start';		//action更新为start，手势开始准备
						ps_x1 = x1;
						ps_y1 = y1;
						ps_x2 = x2;
						ps_y2 = y2;
					} else if (action === 'start') {	//如果action为start
						let diststart = getDistance(ps_x1, ps_y1, ps_x2, ps_y2);
						let distnow = getDistance(x1, y1, x2, y2);
						if (Math.abs(distnow - diststart) >= 2) { //判断如果双指间移动距离绝对值大于等于2
							//当双指间移动距离以绝对值2为判断条件时，缩放与旋转的辨别是最准确的
							action = 'pinch'; //缩放
							ps_x1 = x1;
							ps_y1 = y1;
							ps_x2 = x2;
							ps_y2 = y2;
							bt_PlugManager.bt_DefaultGUIAction.pinchBegan();
						} else { //判断如果双指间移动距离绝对值小于2
							action = 'rotate'; //旋转	
							bt_PlugManager.km.onMouseButtonDown(2, parseInt((x1 + x2) / 2), parseInt((y1 + y2) / 2));
						}
					} else if (action === 'pinch') {
						let diststart = getDistance(ps_x1, ps_y1, ps_x2, ps_y2);
						let distnow = getDistance(x1, y1, x2, y2);
						let scale = distnow / diststart;
						bt_PlugManager.bt_DefaultGUIAction.pinch(scale);
					} else if (action = 'rotate') {
						bt_PlugManager.km.onMouseMove(parseInt((x1 + x2) / 2), parseInt((y1 + y2) / 2));
					}
				});
				touch.on('#canvasgl', 'pinchend', function (ev) {
					action = '';
					ev.preventDefault();
				});
				
			//判断如果是PC端	
			} else {	
				let timer = null;
				let click_times = 0;
				let down_x = -1;
				let down_y = -1;
				let down_key = -1;
			
				function bt_canvase_onMouseMove(event) {
					let loc = bt_PlugManager.getPointOnCanvas(bt_canvasgl, event.clientX, event.clientY);
					if (loc.x != down_x || loc.y != down_y) {
						bt_PlugManager.km.onMouseMove(loc.x, loc.y);
						event.preventDefault();
						event.stopImmediatePropagation();
			
						if (click_times === 1) {
							bt_PlugManager.km.onMouseClick(down_key, down_x, down_y);
						}
						else if (click_times === 2) {
							bt_PlugManager.km.onMouseDbClick(down_key, down_x, down_y);
						}
			
						down_key = -1;
						click_times = 0;
						clearTimeout(timer);
					}
				}
			
				function bt_canvase_onMouseDown(event) {
					let loc = bt_PlugManager.getPointOnCanvas(bt_canvasgl, event.clientX, event.clientY);
			
					bt_PlugManager.km.onMouseButtonDown(event.button, loc.x, loc.y);
					event.preventDefault();
					event.stopImmediatePropagation();
			
					clearTimeout(timer);
					down_x = loc.x;
					down_y = loc.y;
					down_key = event.button;
				}
			
				function bt_canvase_onMouseUp(event) {
					let loc = bt_PlugManager.getPointOnCanvas(bt_canvasgl, event.clientX, event.clientY);
					bt_PlugManager.km.onMouseButtonUp(event.button, loc.x, loc.y);
					event.preventDefault();
					event.stopImmediatePropagation();
			
					clearTimeout(timer);
					if (down_x === loc.x && down_y === loc.y && event.button === down_key) {
						click_times++;
			
						timer = setTimeout(function () {
							if (click_times === 1) {
								bt_PlugManager.km.onMouseClick(down_key, down_x, down_y);
							}
							else if (click_times > 1) {
								bt_PlugManager.km.onMouseDbClick(down_key, down_x, down_y);
							}
			
							click_times = 0;
							down_key = -1;
						}, 300);
					}
					else {
						down_key = -1;
						click_times = 0;
					}
				}
			
				function bt_canvase_onMouseWheel(event) {
					delta = event.wheelDelta ? (event.wheelDelta / 120) : (-event.detail / 3);
					let loc = bt_PlugManager.getPointOnCanvas(event.target, event.clientX, event.clientY);
					bt_PlugManager.km.onMouseWheel(delta, loc.x, loc.y);
					event.preventDefault();
					event.stopImmediatePropagation();
				}
				
				function bt_canvase_onKeyDown(event) {
					bt_PlugManager.km.onKeyDown(event.key);
				}
				
				function bt_canvase_onKeyUp(event) {
					bt_PlugManager.km.onKeyUp(event.key);
				}
				
				bt_canvasgl.addEventListener('mousemove', bt_canvase_onMouseMove, true);
				bt_canvasgl.addEventListener('mousedown', bt_canvase_onMouseDown, true);
				bt_canvasgl.addEventListener('mouseup', bt_canvase_onMouseUp, true);
				bt_canvasgl.oncontextmenu = function (e) {
					e.preventDefault();
					e.stopImmediatePropagation();
				}
				if (browser.versions.Firefox)
					bt_canvasgl.addEventListener('DOMMouseScroll', bt_canvase_onMouseWheel, true);
				else
					bt_canvasgl.addEventListener('mousewheel', bt_canvase_onMouseWheel, true);
				
				bt_canvasgl.addEventListener('keydown', bt_canvase_onKeyDown, true);
				bt_canvasgl.addEventListener('keyup', bt_canvase_onKeyUp, true);
				bt_canvasgl.focus();
			}

		}
	}
})