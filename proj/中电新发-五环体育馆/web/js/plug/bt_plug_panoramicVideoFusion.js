let plug_panoramicVideoFusion = new Plug();
plug_panoramicVideoFusion.js_name = 'plug_panoramicVideoFusion';
plug_panoramicVideoFusion.plug_icon="ali-icon-yunhang";
plug_panoramicVideoFusion.plug_name = '全景视频融合';
plug_panoramicVideoFusion.plug_commandOnly = true;

//插件功能集合
plug_panoramicVideoFusion.plug_commands = [];
//创建功能对象，参数: new Commands(command_name, command_id, command_isActive, command_isOnce)
plug_panoramicVideoFusion.plug_commands[0] = new Command("体育场", 1, false, true);
plug_panoramicVideoFusion.plug_commands[1] = new Command("体育馆", 2, false, true);
plug_panoramicVideoFusion.plug_commands[2] = new Command("游泳馆", 3, false, true);
plug_panoramicVideoFusion.plug_commands[3] = new Command("高清体育场", 4, false, true);
plug_panoramicVideoFusion.plug_commands[4] = new Command("关闭融合", 5, false, true); 

plug_panoramicVideoFusion.command_activate = function(commandID){    
    switch (commandID){
        //1号场馆
        case 1:
            var strs={};
            strs["43000001001321224014"]=`18 42  (512265.52058 3391095.30338 50.2321 0.373490 0.308950)  (512297.19581 3391080.23231 51.5 0.568830 0.295850)  (512302.7916 3391084.57784 69.9 0.580460 0.182500)  (512267.21562 3391100.78252 68.5 0.361240 0.209650)  (512230.87026 3391104.13279 67 0.137170 0.249970)  (512232.45687 3391098.83276 51.5 0.185960 0.353030)  (512233.91216 3391094.00983 36 0.234750 0.456090)  (512263.76237 3391089.62002 36 0.385750 0.408250)  (512291.4765 3391076.04816 36 0.558280 0.398710)  (512297.13405 3391080.313 51.5 0.568830 0.295850)  (512250.43736 3391060.48486 38 0.398210 0.531320)  (512201.51198 3391059.89399 38 0.000000 0.736440)  (512210.92807 3391077.96335 38 0.055690 0.556040)  (512227.99789 3391092.52169 38 0.172570 0.461080)  (512250.35697 3391098.13814 38 0.275910 0.415190)  (512272.70162 3391092.61713 38 0.387580 0.389310)  (512290.20055 3391078.43499 38 0.483240 0.379620)  (512304.59318 3391058.46779 38 0.643420 0.397980)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 0 8 9 10 11 12 10 12 13 10 13 14 10 14 15 10 15 16 10 16 17 ;`;
            strs["43000001001321224016"]=`10 24  (512310.2177 3391041.9955 50.2321 0.247600 0.478500)  (512297.19581 3391080.23231 51.5 0.020670 0.504990)  (512302.7916 3391084.57784 68.9 0.027730 0.378360)  (512317.2047 3391042.42197 68.5 0.264930 0.315010)  (512318.9641 3391002.254 67 0.539370 0.265810)  (512311.96179 3391002.41182 51.5 0.502180 0.462970)  (512304.95948 3391002.56965 36 0.470130 0.632880)  (512302.81608 3391041.54373 36 0.230260 0.641980)  (512291.4765 3391076.04816 36 0.012210 0.656670)  (512297.19581 3391080.23231 51.5 0.020670 0.504990)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 0 8 9 ;`;
            strs["43000001001321224017"]=`15 33  (512308.33164 3390964.00865 50.2321 0.427000 0.302140)  (512296.02019 3390933.18627 51.5 0.611430 0.277810)  (512301.55254 3390928.65685 67.9 0.600670 0.198020)  (512315.41679 3390963.7075 67.5 0.392380 0.173860)  (512318.93699 3391001.77639 67 0.178930 0.187620)  (512311.94824 3391002.17302 51.5 0.226440 0.344450)  (512304.95948 3391002.56965 36 0.265110 0.472090)  (512301.24648 3390964.30981 36 0.456110 0.409990)  (512290.50101 3390937.70491 36 0.625360 0.381100)  (512296.02677 3390933.18088 51.5 0.611430 0.277810)  (512250.72231 3390955.48522 38 0.795870 0.490120)  (512299.7637 3390957.11855 38 0.570890 0.379820)  (512289.80577 3390938.27411 38 0.664780 0.367960)  (512273.0628 3390923.44818 38 0.772630 0.376100)  (512251.00916 3390917.89905 38 0.896660 0.403940)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 0 8 9 10 11 12 10 12 13 10 13 14 ;`;
            strs["43000001001321224018"]=`20 48  (512276.28482 3390917.04071 50.2321 0.570620 0.238510)  (512296.02677 3390933.18088 51.5 0.414810 0.249140)  (512301.55254 3390928.65685 69.9 0.397810 0.166690)  (512279.50685 3390910.63325 68.5 0.568680 0.164460)  (512250.79356 3390903.40842 67 0.739540 0.178600)  (512250.77817 3390910.61278 51.5 0.724870 0.247420)  (512250.76279 3390917.81714 36 0.705600 0.337800)  (512273.0628 3390923.44818 36 0.573030 0.330260)  (512290.50101 3390937.70491 36 0.435020 0.347210)  (512296.02019 3390933.18627 51.5 0.414810 0.249140)  (512250.66176 3390981.52305 38 0.539110 0.528660)  (512216.66682 3390981.43754 38 0.773530 0.655620)  (512216.73229 3390955.41263 38 0.844320 0.504780)  (512250.66154 3390955.41263 38 0.636200 0.437860)  (512284.68229 3390955.55772 38 0.483720 0.381440)  (512284.66661 3390981.60858 38 0.378000 0.441400)  (512284.61014 3391008.0577 38 0.244630 0.517040)  (512250.59025 3391007.98506 38 0.422290 0.637910)  (512216.6103 3391007.91251 38 0.694820 0.823330)  (512216.66682 3390981.43754 38 0.773530 0.655620)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 0 8 9 10 11 12 10 12 13 10 13 14 10 14 15 10 15 16 10 16 17 10 17 18 10 18 19 ;`;
            strs["43000001001321224019"]=`25 57  (512205.35374 3390932.98729 50.2321 0.630340 0.242890)  (512195.97512 3390951.52942 51.5 0.780660 0.243350)  (512188.88453 3390948.94701 67 0.762100 0.072120)  (512199.84735 3390928.4397 64 0.601560 0.097800)  (512221.9698 3390910.5104 64 0.426140 0.125200)  (512225.16443 3390916.93157 51.5 0.470070 0.267150)  (512228.35907 3390923.35274 36 0.520870 0.431270)  (512210.86014 3390937.53488 36 0.644540 0.394710)  (512202.17235 3390953.78646 36 0.796580 0.394710)  (512196.06807 3390951.56327 51.5 0.780660 0.243350)  (512238.10527 3390914.53218 50.2321 0.368140 0.295610)  (512224.90195 3390917.53333 51.5 0.470070 0.267150)  (512221.9698 3390910.5104 64 0.426140 0.125200)  (512236.3817 3390906.94945 64 0.319380 0.157750)  (512250.79356 3390903.40842 64 0.200590 0.210260)  (512250.75371 3390911.53104 51.5 0.270470 0.361980)  (512250.72283 3390917.82701 36 0.382310 0.534170)  (512239.60403 3390920.57429 36 0.450690 0.468510)  (512228.35907 3390923.35274 36 0.520870 0.431270)  (512225.30915 3390917.53333 51.5 0.473500 0.267150)  (512250.72231 3390955.48509 38.1 0.855920 0.766930)  (512250.76279 3390917.81714 38.1 0.430290 0.511280)  (512228.35907 3390923.35274 38.1 0.617760 0.402630)  (512210.86014 3390937.53488 38.1 0.782900 0.390290)  (512201.58626 3390957.57735 38.1 0.916980 0.411840)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 0 8 9 10 11 12 10 12 13 10 13 14 10 14 15 10 15 16 10 16 17 10 17 18 10 18 19 20 21 22 20 22 23 20 23 24 ;`;
            strs["43000001001321224020"]=`20 48  (512218.33265 3391092.57416 50.2321 0.363180 0.288910)  (512232.45687 3391098.83276 51.5 0.483690 0.297810)  (512230.87026 3391104.13279 69.9 0.492050 0.231740)  (512215.4784 3391098.195 68.5 0.359090 0.225400)  (512201.32535 3391085.82525 67 0.231450 0.208180)  (512206.12671 3391081.8943 51.5 0.245150 0.287480)  (512210.92807 3391077.96335 36 0.261640 0.382860)  (512221.1869 3391086.95332 36 0.369330 0.374720)  (512233.91216 3391094.00983 36 0.473200 0.380760)  (512232.45687 3391098.83276 51.5 0.483690 0.297810)  (512250.52422 3391034.23499 38 0.324590 0.521900)  (512284.51416 3391034.30756 38 0.567380 0.585420)  (512284.45812 3391060.5575 38 0.604570 0.484820)  (512250.49813 3391060.48499 38 0.406220 0.442550)  (512216.49821 3391060.4124 38 0.276450 0.414890)  (512216.55426 3391034.16246 38 0.164770 0.480090)  (512216.57036 3391007.91243 38 0.000660 0.586070)  (512250.5496 3391007.91525 38 0.192760 0.653460)  (512284.5702 3391008.05761 38 0.491640 0.749420)  (512284.5541 3391034.30764 38 0.567380 0.585420)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 0 8 9 10 11 12 10 12 13 10 13 14 10 14 15 10 15 16 10 16 17 10 17 18 10 18 19 ;`;
            strs["43000001001321224021"]=`10 24  (512190.33 3390984.08659 50.2321 0.358140 0.592880)  (512189.20113 3391015.35954 51.5 0.567280 0.600420)  (512182.21238 3391015.75617 69.9 0.617070 0.377480)  (512183.23915 3390983.65379 68.5 0.391640 0.389330)  (512188.88453 3390948.94701 67 0.155950 0.437620)  (512195.52844 3390951.36674 51.5 0.142150 0.581940)  (512202.17235 3390953.78646 36 0.128350 0.726260)  (512197.42085 3390984.5194 36 0.343410 0.737620)  (512196.18989 3391014.96292 36 0.530050 0.767120)  (512189.20113 3391015.35954 51.5 0.567280 0.600420)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 0 8 9 ;`;
            strs["43000001001321224022"]=`10 24  (512192.11939 3391049.00446 50.2321 0.504640 0.511660)  (512206.12671 3391081.8943 51.5 0.830360 0.480200)  (512201.32535 3391085.82525 67 0.847570 0.272000)  (512185.24689 3391050.33698 67 0.529430 0.271070)  (512182.21238 3391015.75617 69.9 0.221330 0.293440)  (512190.3942 3391015.29183 51.5 0.179980 0.565890)  (512196.17294 3391014.7644 36 0.159140 0.703200)  (512198.97517 3391047.59085 36 0.488600 0.667310)  (512210.92807 3391077.96335 36 0.815600 0.658770)  (512206.12671 3391081.8943 51.5 0.829190 0.494350)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 0 8 9 ;`;            
            bt_panoramicVideoFusion.createVideo(1,strs);
        break;
        //2号场馆
        case 2:                        
            bt_Util.executeScript("Render\\RenderDataContex\\ModelScene\\ModelScene\\group2.btm.pb\\Show 0;");            
            var strs={};
            strs["43000001001321224132"]=`30 72  (512398.76399 3391177.94535 44.30664 0.694850 0.530890)  (512396.60269 3391184.1388 44.11328 0.577990 0.423690)  (512393.18926 3391181.96239 38 0.481160 0.561720)  (512395.04997 3391176.17269 38.07166 0.591820 0.692920)  (512396.82016 3391170.35212 38 0.726050 0.866130)  (512400.92528 3391171.7519 44.5 0.834880 0.659340)  (512405.03041 3391173.15167 51 0.952630 0.431130)  (512402.7392 3391179.87112 51 0.805160 0.360680)  (512400.44799 3391186.59057 51 0.674810 0.285670)  (512396.60269 3391184.1388 44.11328 0.577990 0.423690)  (512392.96235 3391185.83149 44.5 0.439340 0.351390)  (512389.10608 3391187.3865 44.5 0.336520 0.332830)  (512389.06068 3391183.84288 38 0.361940 0.492000)  (512391.12497 3391182.90263 38 0.429380 0.513280)  (512393.18926 3391181.96239 38 0.481160 0.562000)  (512396.60269 3391184.1388 44.11328 0.581540 0.419000)  (512400.44799 3391186.59057 51 0.674810 0.286120)  (512394.79973 3391188.76034 51 0.477860 0.209590)  (512389.15148 3391190.93011 51 0.316030 0.166590)  (512389.10608 3391187.3865 44.5 0.336520 0.332830)  (512383.12027 3391185.3858 44.5 0.248700 0.334290)  (512377.13446 3391183.38511 44.5 0.162860 0.324190)  (512378.13852 3391180.29422 38 0.162860 0.491680)  (512383.65287 3391182.08587 38 0.262400 0.491680)  (512389.06068 3391183.84288 38 0.361940 0.491680)  (512389.10608 3391187.3865 44.11328 0.338040 0.344810)  (512389.15148 3391190.93011 51 0.316030 0.166060)  (512382.31326 3391188.69785 51 0.232600 0.149310)  (512376.1304 3391186.476 51 0.149180 0.132560)  (512377.13446 3391183.38511 44.5 0.162860 0.324190)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 0 8 9 10 11 12 10 12 13 10 13 14 10 14 15 10 15 16 10 16 17 10 17 18 10 18 19 20 21 22 20 22 23 20 23 24 20 24 25 20 25 26 20 26 27 20 27 28 20 28 29 ;`;
            strs["43000001001321224133"]=`30 72  (512367.30449 3391180.23432 44.5 0.770230 0.361080)  (512357.47451 3391177.08354 44.5 0.585630 0.347980)  (512359.388 3391174.20218 38 0.554960 0.512670)  (512368.76326 3391177.2482 38 0.752980 0.539930)  (512378.13852 3391180.29422 38 0.976250 0.570660)  (512377.13446 3391183.38511 44.11328 0.973550 0.375800)  (512376.14374 3391186.476 51 0.974980 0.181030)  (512365.87085 3391183.14308 51 0.774460 0.176370)  (512355.56103 3391179.96489 51 0.616310 0.183300)  (512357.47451 3391177.08354 44.5 0.585630 0.347980)  (512355.17721 3391173.46603 44.5 0.455980 0.373030)  (512352.87991 3391169.84852 44.5 0.355220 0.419670)  (512356.71639 3391170.59657 38 0.423760 0.556440)  (512358.05219 3391172.39937 38 0.478900 0.511940)  (512359.388 3391174.20218 38 0.554960 0.512670)  (512357.47451 3391177.08354 44.5 0.585630 0.347980)  (512355.56103 3391179.96489 51 0.616310 0.183300)  (512352.30223 3391174.53269 51 0.432230 0.216820)  (512349.04343 3391169.10048 51 0.282940 0.256200)  (512352.87991 3391169.84852 44.5 0.355220 0.419670)  (512354.99322 3391163.32972 44.5 0.228560 0.493850)  (512356.93715 3391157.33442 44.5 0.078340 0.604650)  (512360.66138 3391158.45444 38 0.165060 0.851920)  (512358.68888 3391164.52551 38 0.320820 0.679290)  (512356.7245 3391170.59657 38 0.423760 0.556440)  (512352.87991 3391169.84852 44.5 0.355220 0.419670)  (512349.04343 3391169.10048 51 0.277280 0.264120)  (512351.29756 3391162.13393 51 0.136290 0.308400)  (512353.21292 3391156.2144 51 0.000000 0.380130)  (512356.88018 3391157.31729 44.59942 0.078340 0.604650)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 0 8 9 10 11 12 10 12 13 10 13 14 10 14 15 10 15 16 10 16 17 10 17 18 10 18 19 20 21 22 20 22 23 20 23 24 20 24 25 20 25 26 20 26 27 20 27 28 20 28 29 ;`;
            strs["43000001001321224134"]=`16 36  (512385.60506 3391156.60047 44.5 0.826090 0.214230)  (512384.00936 3391159.90984 38 0.819010 0.410320)  (512396.49785 3391163.96819 38 0.579990 0.410320)  (512398.40038 3391160.86029 44.5 0.601500 0.229980)  (512399.7572 3391157.57262 51 0.623000 0.065700)  (512387.20077 3391153.2911 51 0.832880 0.026100)  (512399.46752 3391166.24107 44.5 0.485030 0.268610)  (512398.01441 3391160.72027 44.52002 0.601500 0.229980)  (512396.49785 3391163.96819 38 0.579990 0.394260)  (512396.69985 3391166.53892 38 0.507980 0.394260)  (512397.00442 3391170.41495 38 0.450890 0.444080)  (512400.92528 3391171.7519 42.5 0.379380 0.323880)  (512405.03041 3391173.15167 51 0.281510 0.159370)  (512402.27603 3391165.32198 51 0.454050 0.099120)  (512399.54597 3391157.50059 51 0.623000 0.065700)  (512398.01441 3391160.72027 44.52002 0.601500 0.229980)  0 1 2 0 2 3 0 3 5 3 4 5 6 7 8 6 8 9 6 9 10 6 10 11 6 11 12 6 12 13 6 13 14 6 14 15 ;`;
            strs["43000001001321224135"]=`26 60  (512356.88018 3391157.31729 44.59942 0.717310 0.473770)  (512353.42002 3391156.2144 51 0.795360 0.301040)  (512355.05802 3391150.51198 51 0.678170 0.252150)  (512358.47659 3391152.58452 44.5 0.603130 0.398070)  (512361.89516 3391154.65706 38 0.528100 0.543990)  (512360.66138 3391158.45444 38 0.633590 0.659020)  (512362.12832 3391151.10072 44.5 0.502070 0.371970)  (512365.27566 3391149.82188 44.5 0.370100 0.369300)  (512364.85696 3391153.68593 38 0.398790 0.517320)  (512363.37606 3391154.1715 38 0.478700 0.521770)  (512361.89516 3391154.65706 38 0.528360 0.546060)  (512358.47659 3391152.58452 44.5 0.599470 0.407520)  (512355.05802 3391150.51198 51 0.678170 0.255080)  (512360.37619 3391148.2349 51 0.525440 0.222170)  (512365.69437 3391145.95782 51 0.342500 0.222170)  (512365.27566 3391149.82188 44.5 0.368630 0.361740)  (512375.38091 3391153.19135 44.5 0.199620 0.377020)  (512385.60506 3391156.60047 44.5 0.022670 0.393820)  (512384.00936 3391159.90984 38 0.036720 0.591960)  (512374.23033 3391156.73197 38 0.223680 0.552440)  (512364.85696 3391153.68593 38 0.398790 0.515420)  (512365.27566 3391149.82188 44.5 0.368630 0.359230)  (512365.69437 3391145.95782 51 0.342500 0.207500)  (512376.55773 3391149.66202 51 0.184980 0.197510)  (512387.20077 3391153.2911 51 0.009050 0.201590)  (512385.60506 3391156.60047 44.5 0.022670 0.393820)  0 1 2 0 2 3 0 3 5 3 4 5 6 7 8 6 8 9 6 9 10 6 10 11 6 11 12 6 12 13 6 13 14 6 14 15 16 17 18 16 18 19 16 19 20 16 20 21 16 21 22 16 22 23 16 23 24 16 24 25 ;`;
            strs["43000001001321225142"]=`5 9  (512380.62832 3391158.81111 38.01 0.143480 0.538470)  (512374.07714 3391178.9747 38.01 0.895560 0.990710)  (512355.91186 3391173.07278 38.01 0.970260 0.544690)  (512362.4634 3391152.9081 38.01 0.429720 0.338280)  (512380.62832 3391158.81111 38.01 0.143480 0.538470)  0 1 2 0 2 3 0 3 4 ;`;
            strs["43000001001321225151"]=`10 18  (512373.19354 3391178.68762 38 0.079650 0.479900)  (512379.74594 3391158.52437 38 0.617790 0.893460)  (512398.79361 3391164.71298 38 0.918490 0.405310)  (512392.24242 3391184.87663 38 0.415690 0.242740)  (512373.19354 3391178.68762 38 0.079650 0.479900)  (512379.74594 3391158.52437 38 0.079650 0.479900)  (512373.19354 3391178.68762 38 0.617790 0.893460)  (512355.91186 3391173.07278 38 0.918490 0.405310)  (512362.4634 3391152.9081 38 0.415690 0.242740)  (512379.74594 3391158.52437 38 0.079650 0.479900)  0 1 2 0 2 3 0 3 4 5 6 7 5 7 8 5 8 9 ;`;
            bt_panoramicVideoFusion.createVideo(2,strs);            
        break;
        //3号场馆
        case 3:
            bt_Util.executeScript("Render\\RenderDataContex\\ModelScene\\ModelScene\\group2.btm.pb\\Show 0;");
            var strs={};
            strs["43000001001321226071"]=`20 48  (512138.51316 3391175.38571 36.5 0.553260 0.585200)  (512153.79359 3391170.84743 36.5 0.908440 0.551980)  (512153.79359 3391170.84743 43 0.879940 0.428940)  (512138.51316 3391175.38571 43 0.544560 0.462190)  (512123.58407 3391179.56358 43 0.247240 0.480350)  (512123.58407 3391179.56358 36.5 0.246840 0.616450)  (512122.25866 3391175.10798 36.5 0.246180 0.773570)  (512137.1747 3391170.77652 36.5 0.588350 0.721780)  (512152.52997 3391166.31751 36.5 0.970480 0.663950)  (512153.79359 3391170.84743 36.5 0.908440 0.551980)  (512141.22834 3391185.79269 50 0.531110 0.282030)  (512156.12894 3391181.62413 50 0.842400 0.266870)  (512157.87927 3391190.06733 55 0.784650 0.042220)  (512143.4207 3391194.39928 55 0.512480 0.042220)  (512128.96199 3391198.08236 55 0.255890 0.042220)  (512126.32774 3391189.96126 50 0.247350 0.290420)  (512123.58407 3391179.56358 43 0.247060 0.480220)  (512138.51316 3391175.38571 43 0.544370 0.462200)  (512153.79359 3391170.84743 43 0.879940 0.428940)  (512156.12894 3391181.62413 50 0.842400 0.266870)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 0 8 9 10 11 12 10 12 13 10 13 14 10 14 15 10 15 16 10 16 17 10 17 18 10 18 19 ;`;
            strs["43000001001321226072"]=`20 48  (512111.11382 3391183.25127 36.5 0.307950 0.626930)  (512123.58407 3391179.56358 36.5 0.552390 0.622740)  (512123.58407 3391179.56358 43 0.548400 0.477990)  (512111.11382 3391183.25127 43 0.303790 0.484550)  (512098.55284 3391186.85536 43 0.030900 0.493770)  (512098.55284 3391186.85536 36.5 0.018010 0.645710)  (512097.20818 3391182.38238 36.5 0.003990 0.811060)  (512109.56469 3391178.72221 36.5 0.272770 0.792870)  (512122.25866 3391175.10798 36.5 0.557280 0.792870)  (512124.08612 3391181.27738 36.5 0.557790 0.622650)  (512113.87429 3391193.51482 50 0.297750 0.274680)  (512126.32774 3391189.96126 50 0.542280 0.271000)  (512128.96199 3391198.42443 55 0.534190 0.004910)  (512116.1317 3391201.72435 55 0.289780 0.004990)  (512104.11335 3391204.59459 55 0.071120 0.019250)  (512101.62254 3391196.94845 48 0.048880 0.278440)  (512098.55284 3391186.85536 43 0.030900 0.488060)  (512111.11382 3391183.25127 43 0.303790 0.478950)  (512123.58407 3391179.56358 43 0.548400 0.477990)  (512126.32774 3391189.96126 50 0.542280 0.271000)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 0 8 9 10 11 12 10 12 13 10 13 14 10 14 15 10 15 16 10 16 17 10 17 18 10 18 19 ;`;
            strs["43000001001321226073"]=`20 48  (512130.86262 3391158.75084 36.5 0.378210 0.440920)  (512126.95959 3391146.24434 36.5 0.559850 0.195730)  (512139.2229 3391142.61179 36.5 0.428460 0.109360)  (512142.9435 3391155.17232 36.5 0.237530 0.287440)  (512146.69229 3391167.82801 36.5 0.005230 0.504120)  (512134.40079 3391171.36542 36.5 0.139550 0.731030)  (512122.34764 3391174.93573 36.5 0.298780 1.000000)  (512118.37865 3391162.44876 36.5 0.518890 0.594400)  (512114.6575 3391149.88637 36.5 0.689130 0.280710)  (512126.95959 3391146.24434 36.5 0.559850 0.195730)  (512113.87429 3391193.51482 50 0.297750 0.274680)  (512126.32774 3391189.96126 50 0.542280 0.271000)  (512128.96199 3391198.42443 55 0.534190 0.004910)  (512116.1317 3391201.72435 55 0.289780 0.004990)  (512104.11335 3391204.59459 55 0.071120 0.019250)  (512101.62254 3391196.94845 48 0.048880 0.278440)  (512098.55284 3391186.85536 43 0.030900 0.488060)  (512111.11382 3391183.25127 43 0.303790 0.478950)  (512123.58407 3391179.56358 43 0.548400 0.477990)  (512126.32774 3391189.96126 50 0.542280 0.271000)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 0 8 9 10 11 12 10 12 13 10 13 14 10 14 15 10 15 16 10 16 17 10 17 18 10 18 19 ;`;
            strs["43000001001321226074"]=`10 24  (512105.8441 3391166.16164 36.5 0.450480 0.543910)  (512109.47948 3391178.74745 36.5 0.698930 0.726620)  (512097.20818 3391182.38238 36.5 0.791460 0.436600)  (512093.65063 3391169.77354 36.5 0.568760 0.330800)  (512090.18576 3391157.49314 36.5 0.346060 0.225000)  (512102.07603 3391153.61519 36.5 0.207370 0.365130)  (512114.49494 3391149.93654 36.5 0.094520 0.479160)  (512118.37865 3391162.44876 36.5 0.349010 0.729990)  (512122.25866 3391175.10798 36.5 0.614390 0.991570)  (512109.47948 3391178.74745 36.5 0.698930 0.726620)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 0 8 9 ;`;
            bt_panoramicVideoFusion.createVideo(3,strs);
        break;
        //测试
        case 4:
            var strs={};
            strs["43000001001321224018"]=`9 21  (512250.53705 3390971.88499 36.3 0.588680 0.487480)  (512250.6615 3390955.50526 36.3 0.638040 0.440070)  (512284.69237 3390955.45133 36.3 0.486600 0.383140)  (512284.68229 3391008.05761 36.3 0.259200 0.522920)  (512259.72026 3391008.00456 36.3 0.375100 0.600680)  (512241.4203 3391008.00424 36.3 0.488230 0.675990)  (512216.65993 3391007.96548 36.3 0.693570 0.811590)  (512216.72239 3390955.4125 36.3 0.848280 0.510600)  (512250.506 3390955.37981 36.3 0.638040 0.440400)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 ;`;
            strs["43000001001321224020"]=`11 27  (512250.49327 3391044.05487 36.3 0.438560 0.494530)  (512284.49329 3391044.08348 36.3 0.643930 0.552340)  (512284.45812 3391060.5575 36.3 0.669380 0.494530)  (512250.38875 3391060.45488 36.3 0.481190 0.454350)  (512216.49821 3391060.4124 36.3 0.329540 0.413660)  (512216.53313 3391044.05625 36.3 0.269970 0.447080)  (512216.6103 3391007.91251 36.3 0.077830 0.550170)  (512241.58355 3391007.91251 36.3 0.220920 0.611070)  (512259.57026 3391008.00424 36.3 0.347520 0.663140)  (512284.52029 3391008.00456 36.3 0.558290 0.746900)  (512284.49329 3391044.08348 36.3 0.643930 0.552340)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 0 8 9 0 9 10 ;`;
            strs["43000001001321223248"]=`70 156  (512305.60531 3391079.23535 48.3 0.787640 0.179020)  (512314.26355 3391066.61799 50.5 0.855790 0.194050)  (512326.02676 3391071.53661 63 0.907860 0.105160)  (512316.9375 3391087.25 62.8 0.824560 0.098910)  (512302.8125 3391101.75 62.3 0.734500 0.090860)  (512293.61504 3391091.80312 48 0.713200 0.165490)  (512286.00783 3391083.57607 36.3 0.677370 0.237300)  (512295.375 3391072 36.3 0.734160 0.250840)  (512300.79771 3391060.98743 36.3 0.785390 0.269370)  (512314.26355 3391066.61799 50.5 0.855790 0.194050)  (512282.64283 3391101.64539 48 0.654720 0.158510)  (512293.61504 3391091.80312 48 0.713200 0.165490)  (512302.8125 3391101.75 62.3 0.734500 0.090860)  (512289.21956 3391112.71009 62.3 0.667220 0.088180)  (512273.9073 3391119.57113 62.3 0.581130 0.088180)  (512270.14764 3391107.7364 48 0.570820 0.148490)  (512267.03021 3391097.92332 36.3 0.554000 0.219570)  (512277.0391 3391092.21767 36.3 0.626380 0.227940)  (512286.00783 3391083.57607 36.3 0.677370 0.237300)  (512293.61504 3391091.80312 48 0.713200 0.165490)  (512255.21644 3391111.02079 48 0.500010 0.148490)  (512270.14764 3391107.7364 48 0.570820 0.148490)  (512273.9073 3391119.57113 62.3 0.581130 0.088180)  (512255.90625 3391123 62.3 0.505240 0.088450)  (512240.03125 3391123 62.3 0.419540 0.088740)  (512242.20051 3391110.93349 48 0.423600 0.149920)  (512244.03125 3391100.75 36.3 0.431220 0.218930)  (512254.625 3391100.75 36.3 0.493200 0.218410)  (512267.03021 3391097.92332 36.3 0.554000 0.219570)  (512270.14764 3391107.7364 48 0.570820 0.148490)  (512227.39558 3391107.40013 48 0.347220 0.155020)  (512242.20051 3391110.93349 48 0.423600 0.149920)  (512240.03125 3391123 62.3 0.419540 0.088740)  (512222.28125 3391118.5 62.3 0.331710 0.088560)  (512207.97247 3391110.99492 62.3 0.243790 0.086830)  (512214.99119 3391101.41713 48 0.267730 0.165560)  (512222.625 3391091 36.3 0.299710 0.234490)  (512232.1875 3391097 36.3 0.363830 0.225020)  (512244.03125 3391100.75 36.3 0.431220 0.218930)  (512242.20051 3391110.93349 48 0.423600 0.149920)  (512204.8701 3391093.95291 48 0.208080 0.176110)  (512214.99119 3391101.41713 48 0.267730 0.165560)  (512207.97247 3391110.99492 62.3 0.243790 0.086830)  (512196.59725 3391102.63199 62.3 0.174050 0.085760)  (512185.16544 3391091.22479 62.3 0.095270 0.082480)  (512196.44772 3391083.13331 48 0.141380 0.191520)  (512207.4267 3391075.25935 36.3 0.189660 0.263630)  (512214.54245 3391083.80563 36.3 0.242970 0.247090)  (512222.625 3391091 36.3 0.299710 0.234490)  (512214.99119 3391101.41713 48 0.267730 0.165560)  (512189.43369 3391069.75122 48 0.058870 0.199460)  (512200.0413 3391062.59765 36.3 0.135420 0.284560)  (512207.4267 3391075.25935 36.3 0.189660 0.263630)  (512196.44772 3391083.13331 48 0.141380 0.191520)  (512185.16544 3391091.22479 62.3 0.095270 0.082480)  (512175.50482 3391074.56463 62.3 0.000000 0.077860)  (512250.4696 3391060.45003 36.3 0.463450 0.289890)  (512284.24691 3391060.45488 36.3 0.688510 0.285610)  (512285.9375 3391083.5 36.3 0.677370 0.237300)  (512267.03021 3391097.92332 36.3 0.554000 0.219570)  (512244.03125 3391100.75 36.3 0.431020 0.217160)  (512222.625 3391091 36.3 0.299710 0.234490)  (512207.4267 3391075.25935 36.3 0.189660 0.263630)  (512216.49821 3391060.4124 36.3 0.238970 0.294150)  (512284.24691 3391060.45488 36.3 0.688510 0.285610)  (512300.35178 3391060.80097 36.3 0.785390 0.269370)  (512285.9375 3391083.5 36.3 0.734160 0.250840)  (512216.49821 3391060.4124 36.3 0.238970 0.294150)  (512207.4267 3391075.25935 36.3 0.189660 0.263630)  (512200.0413 3391062.59765 36.3 0.135420 0.284560)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 0 8 9 10 11 12 10 12 13 10 13 14 10 14 15 10 15 16 10 16 17 10 17 18 10 18 19 20 21 22 20 22 23 20 23 24 20 24 25 20 25 26 20 26 27 20 27 28 20 28 29 30 31 32 30 32 33 30 33 34 30 34 35 30 35 36 30 36 37 30 37 38 30 38 39 40 41 42 40 42 43 40 43 44 40 44 45 40 45 46 40 46 47 40 47 48 40 48 49 50 51 52 50 52 53 50 53 55 53 54 55 56 57 58 56 58 59 56 59 60 56 60 61 56 61 62 56 62 63 64 65 66 67 68 69 ;`;
            strs["43000001001321224243"]=`48 102  (512216.72239 3390955.4125 36.3 0.575990 0.712630)  (512198.52127 3390955.13867 36.3 0.746360 0.717020)  (512214.01159 3390930.67878 36.3 0.656690 0.624690)  (512250.506 3390955.37981 36.3 0.325800 0.672360)  (512216.72239 3390955.4125 36.3 0.575990 0.712630)  (512214.01159 3390930.67878 36.3 0.656690 0.624690)  (512233.28125 3390916.25 36.3 0.479880 0.551170)  (512265.02771 3390915.15254 36.3 0.335940 0.532780)  (512286.9375 3390931.75 36.3 0.192500 0.549490)  (512284.69237 3390955.45133 36.3 0.110750 0.638130)  (512250.69128 3390955.50522 36.3 0.325800 0.672360)  (512196.18488 3390932.64574 48 0.793610 0.533920)  (512186.61936 3390944.72176 48.9 0.858960 0.580530)  (512173.65625 3390937.75 62 0.981350 0.432150)  (512183.65625 3390923 62 0.882620 0.417850)  (512195.5839 3390911.17542 62 0.790720 0.405430)  (512204.79775 3390920.9271 48 0.730010 0.504730)  (512214.01159 3390930.67878 36 0.656690 0.624690)  (512199.6875 3390951.75 36 0.732600 0.693270)  (512186.61936 3390944.72176 48.9 0.858960 0.580530)  (512215.71118 3390913.68568 48 0.626690 0.472290)  (512204.79775 3390920.9271 48 0.730010 0.504730)  (512195.5839 3390911.17542 62.00819 0.790720 0.405430)  (512223.9375 3390893.75 62.00819 0.525850 0.403190)  (512228.65082 3390905.09981 48 0.510330 0.453130)  (512233.28125 3390916.25 36 0.479880 0.551170)  (512214.01159 3390930.67878 36 0.656690 0.624690)  (512204.79775 3390920.9271 48 0.730010 0.504730)  (512268.23438 3390903.875 48 0.336500 0.446570)  (512228.65082 3390905.09981 48 0.510330 0.453130)  (512223.9375 3390893.75 62 0.526990 0.399510)  (512271.46875 3390892.5 62 0.336420 0.392220)  (512304.3125 3390912.75 62 0.169950 0.392880)  (512295.32679 3390922.45572 48 0.179010 0.455820)  (512286.9375 3390931.75 36 0.192500 0.549490)  (512265 3390915.25 36 0.335940 0.532780)  (512233.28125 3390916.25 36 0.479880 0.551170)  (512228.65082 3390905.09981 48 0.510330 0.453130)  (512284.69237 3390955.45133 36.3 0.110750 0.638130)  (512286.9375 3390931.75 36.3 0.192500 0.549490)  (512298.21006 3390948.24991 36.3 0.192500 0.549490)  (512295.32679 3390922.45572 48 0.179010 0.455820)  (512304.3125 3390912.75 62 0.169950 0.392880)  (512321.21875 3390933.25 62 0.001760 0.403420)  (512311.535 3390939.574 51.05 0.000000 0.489320)  (512298.1497 3390948.365 36 0.035880 0.601210)  (512286.9375 3390931.75 36.33 0.192500 0.549490)  (512295.32679 3390922.45572 48 0.179010 0.455820)  0 1 2 3 4 5 3 5 6 3 6 7 3 7 8 3 8 9 3 9 10 11 12 13 11 13 14 11 14 15 11 15 16 11 16 17 11 17 18 11 18 19 20 21 22 20 22 23 20 23 24 20 24 25 20 25 26 20 26 27 28 29 30 28 30 31 28 31 32 28 32 33 28 33 34 28 34 35 28 35 36 28 36 37 38 39 40 41 42 43 41 43 44 41 44 45 41 45 46 41 46 47 ;`;
            strs["43000001001321224245"]=`26 54  (512284.55428 3391034.22215 36.3 0.268590 0.594430)  (512284.61014 3391008.05761 36.3 0.498960 0.591770)  (512310.97642 3391007.96734 36.3 0.492270 0.449580)  (512308.64756 3391034.99991 36.3 0.284830 0.459860)  (512299.21875 3391065 36.3 0.015530 0.497080)  (512284.49803 3391060.56954 36.3 0.038210 0.597100)  (512284.5541 3391034.30764 36.3 0.268590 0.594430)  (512284.66515 3390982.29191 36.3 0.730530 0.587850)  (512284.68229 3390955.55772 36.3 0.962090 0.583940)  (512298.21006 3390948.24991 36.3 0.948550 0.476520)  (512308.95841 3390982.59064 36.3 0.706230 0.453830)  (512310.97642 3391007.96734 36.3 0.492270 0.449580)  (512284.61014 3391008.0577 36.3 0.498960 0.591770)  (512284.625 3390982.39283 36.3 0.730530 0.587850)  (512308.6875 3391035 36.3 0.284830 0.459860)  (512311.06944 3391007.87491 36.3 0.492270 0.449580)  (512340.50397 3391008.6991 62 0.483960 0.126800)  (512338.00421 3391036.93445 62 0.272440 0.155540)  (512322.6875 3391078.5 62 0.005310 0.245090)  (512299.17881 3391064.99991 36.3 0.015530 0.497080)  (512308.95841 3390982.59064 36.3 0.706230 0.453830)  (512298.21006 3390948.24991 36.3 0.964340 0.480050)  (512321.21875 3390933.25 62 0.981480 0.222530)  (512337.15758 3390975.38393 62 0.707420 0.148710)  (512340.50392 3391008.69856 62 0.483960 0.126800)  (512311.06944 3391007.87491 36.3 0.492270 0.449580)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 7 8 9 7 9 10 7 10 11 7 11 12 7 12 13 14 15 16 14 16 17 14 17 19 17 18 19 20 21 22 20 22 23 20 23 25 23 24 25 ;`;
            strs["43000001001321224251"]=`20 48  (512192.51974 3390974.43651 36 0.243620 0.655560)  (512189.23438 3390998.875 36 0.439730 0.639760)  (512157.96875 3390996.25 62 0.439730 0.272950)  (512162.09375 3390969.125 62 0.261470 0.296020)  (512173.65625 3390937.75 62 0.026340 0.371550)  (512199.59124 3390951.69823 36 0.030700 0.674630)  (512216.68247 3390955.40404 36 0.013940 0.765640)  (512216.72239 3390982.03973 36 0.279800 0.764280)  (512216.62692 3391000.12727 36 0.418250 0.761610)  (512189.23438 3390998.875 36 0.439730 0.639760)  (512192.2553 3391039.49871 36.30186 0.740670 0.641450)  (512202.09375 3391067 36.30186 0.989760 0.655210)  (512177.25 3391081 62 0.992040 0.358800)  (512162.53125 3391046.75 62 0.721700 0.279980)  (512157.96875 3390996.25 62 0.440680 0.271110)  (512189.23438 3390998.875 36.30649 0.440680 0.639760)  (512216.62692 3391000.12727 36.30649 0.418250 0.761610)  (512216.51338 3391034.60296 36.4 0.707140 0.753120)  (512216.51338 3391060.41244 36.4 0.974180 0.741150)  (512202.09375 3391067 36.30186 0.989760 0.656280)  0 1 2 0 2 3 0 3 4 0 4 5 0 5 6 0 6 7 0 7 8 0 8 9 10 11 12 10 12 13 10 13 14 10 14 15 10 15 16 10 16 17 10 17 18 10 18 19 ;`;            
            bt_panoramicVideoFusion.createVideo(4,strs);
        break;
        //关闭融合
        case 5:
            bt_Util.executeScript("Render\\RenderDataContex\\ModelScene\\ModelScene\\group2.btm.pb\\Show 1;");           
            Array.from(new Set(bt_panoramicVideoFusion.videoIds)).forEach((elem)=>{
                bt_Util.executeScript("Render\\RenderDataContex\\VideoPriSet\\DelPri videoPri-"+elem+";");
                MonitorConnPool.stopLoadVideo(elem,3);
            });
            bt_panoramicVideoFusion.videoIds=[];
            [1,2,3].forEach(function(elem){
                if($("#videosBox"+elem).length!==0){
                    $("#videosBox"+elem).remove();
                }
            });
        break;
    }
};

//插件激活
plug_panoramicVideoFusion.plug_activate = function(){
    
};

//插件关闭
plug_panoramicVideoFusion.plug_deactivate = function () {
    
};


bt_PlugManager.insert_plug(plug_panoramicVideoFusion);

let bt_panoramicVideoFusion={
    videoIds:[],
    createVideo:function(type,scriptStrs){
        if($("#videosBox"+type).length===0){
            let html=`<div id="videosBox${type}" style="display:none"></div>`;
            $("body").append(html);
        }
        for (const key in scriptStrs) {
            if (scriptStrs.hasOwnProperty(key)) {
                const element = scriptStrs[key];
                $("#videosBox"+type).append(`<video id="video-${key}"></video>`);
                MonitorConnPool.play(key,document.getElementById("video-"+key),3);
                bt_Util.executeScript(`Render\\RenderDataContex\\VideoPriSet\\SetPri videoPri-${key} ${key} 0 0 0 ${element} ;`);
                bt_panoramicVideoFusion.videoIds.push(key);
            }
        }        
        bt_PlugManager.addEventListener("DevTexture\\UpdateVideoTexture", bt_panoramicVideoFusion.UpdateVideoTexture);
        bt_Util.executeScript("Render\\ForceRedraw;");
    },
    UpdateVideoTexture:function (ep) {
        var video=document.getElementById("video-"+ep[0]);
        GLctx.texImage2D(GLctx.TEXTURE_2D, 0, GLctx.RGB, GLctx.RGB, GLctx.UNSIGNED_BYTE, video);
    },    
};
