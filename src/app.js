/* Space Tour using Pannellum JS*/

    $(document).ready(function($){
        console.log("1. All dependencies Loaded, loading app now...", $, pannellum);
        //initialize App object ST for Space Tour
        window.ST = window.ST || {};
        ST.narrative = window.data || data;
        // audio player config
        var cssSelector =  {jPlayer: "#jp_player_1", cssSelectorAncestor: "#jp_selector_1"};
        var playerOptions = {
          playlistOptions: {
            autoPlay: true,
            enableRemoveControls: true
          },
          swfPath: "src/js/jplayer/jplayer",
          useStateClassSkin: true,
          smoothPlayBar: true,
          supplied: "mp3"
        };
        ST.playlist = [];
        ST.player = new jPlayerPlaylist(cssSelector, ST.playlist, playerOptions);
        ST.playerDOM = $('#media-player-widget');
        var playerCloseDOM = $('#media-player-widget .close');
        playerCloseDOM.on('click', function(e){
            e.preventDefault();
            ST.player.pause();
            ST.playerDOM.addClass('hidden');
        });
        ST.imageGalleryDOM = $("#sidebar-img-container");
        // Init App
        ST.init = function(){
            console.log("2. App init", this, this.config);
            //Routes init
            this.routeInit();
            //Pannellum viewer init
            pannellum.viewer('panorama', this.config);
            //Bind Events
            ST.bindUIEvents();
            console.log("3. App loaded, have a gud time :)");

        };

        //Route handler

        ST.routeInit = function(){
            //show
             routie('*/:name?', function(name) {
                var $sidebar = $("#narration");
                if(name.indexOf('&') > -1)
                    {
                        var temp = name.split('=');
                        ST.queryParam = temp[1];
                        ST.sideBarContentFactory(ST.queryParam);
                        if(!$sidebar.hasClass('movein')) {
                            $sidebar.removeClass('moveout');
                            $sidebar.addClass('movein');
                        }
                    }
                else
                    window.location.hash="";

            });
        }


        // Bind any UI events
        ST.bindUIEvents = function() {


            //hide
            //close fn
            $( "#close" ).click(function() {
             //$("#close").css("display", "none");
             //$("#title").css("display", "none");
             //$("#narration").css("display", "none");
             window.location.hash="panorama";
             if($("#narration").hasClass('moveout')) {
                   
                    $('#narration').removeClass('moveout');
                }
                else{
                    
                    $('#narration').removeClass('movein');
                    $('#narration').addClass('moveout');
                }

            });

        };

        //UI /UX for Sidebar templates and content
        ST.sideBarContentFactory = function(id){
            //Initialize all variables
            var titleDOM = $("#title");
            var contentsDOM = $("#contents");
            //filter data
            var content = _.find(ST.narrative, function(item, index, data){
            return item.id === id;
            });


            
            //setup Templates and compile with data
            //Title
            var titleTemplate = _.template("<h3><%=title%></h3>");

            //content
            var contentTemplate = _.template(
            "<div id='space-at-the-top' class='space-at-the-top'></div>"+
            "<p class='description'><%=description%>"+
            "<span data-tag='<%=id%>' data-component='audio' class='audio-embed'></span></p>"+
            "<ul id='ul-li'> </ul>"
            
            );
            //Image template
            var imgTemplate = _.template("<li class='image-container' data-src='<%=item%>'><img src='<%=item%>'></li>");

            var titleCompiled = titleTemplate({
                title: content.title
            });
            var contentCompiled = contentTemplate({
                description: content.description,
                id: content.id
            });

            //DOM Operations - to append compiled content
            //clear previous content-stale DOM
            titleDOM.html('');
            contentsDOM.html('');
            // render updated data
            titleDOM.append(titleCompiled);
            contentsDOM.append(contentCompiled);
            var imgUl = contentsDOM.find('#ul-li');
           
            // Check media type
            if(content.urls.audio){
                /*var audioTemplate = _.template("<div class='audio-container'><center><audio controls>"+
                            "<source src='<%=url%>'> type='audio/mpeg'>"+
                            "</audio></center></div>");*/
                var audioTemplate = _.template("<img src='imgs/components/sound-icon.svg' data-url='<%=url%>' data-title='<%=title%>' data-interviewee='Deepti Trivedi' class='audio-icon'  onmouseover="+"this.src='imgs/components/sound-icon-hover.svg'; onmouseout="+"this.src='imgs/components/sound-icon.svg';>");
                console.log(content.urls.audio, "audio present");
                var audioPlayerCompiled = audioTemplate({url: content.urls.audio, title:content.title});
              
                contentsDOM.find('span').append(audioPlayerCompiled);
                contentsDOM.find('span').on('click', function(e){
                    e.preventDefault();
                    //var currentActive = _.findWhere(ST.narrative, {id: ST.queryParam});
                    var playlist = []
                    playlist.push({title: e.target.dataset.title,
                                   mp3: e.target.dataset.url,
                                   artist: e.target.dataset.interviewee
                                     });
                    console.log(playlist);
                    if(ST.playerDOM.hasClass('hidden')){
                        ST.playerDOM.removeClass('hidden');
                    }
                    
                    ST.player.setPlaylist(playlist);
                    //console.log(e.target, e.currentTarget, e.target.dataset);
                });
               /* var icon = "<span class='audio-player-trigger' data-component='audio' aria-hidden='true' data-url= '"+content.urls.audio+"'><img src='imgs/components/small-sound.svg' onmouseover='this.src='imgs/components/small-sound-hover.svg'; onmouseout='this.src='imgs/components/small-sound.svg';</span>";
                appendToDom(icon, "audio");

                function appendToDom(elm, type){
                    $("#contents").append(elm);
                    if(type == "audio"){
                       // bindAudioEvent();
                    }
                    if(type =="img"){
                       // imgViewer();
                    }
                }


                
                function bindAudioEvent(){
                    $(".audio-player-trigger").on("click", function(event){
                        console.log(event.currentTarget, event);
                        var audioPlayerDom = audioTemplate(event.currentTarget.dataset);
                        $('#contents').append(audioPlayerDom);
                    });
                }
                */

            }
       
            

            if(content.urls.img){
                

                _.each(content.urls.img, function(item){
                    var imgElm = imgTemplate({item:item});
                    imgUl.append(imgElm);
                    
                }, this);

                //bind click event to launcg light gallery
                 imgUl.find('img').click(function(e){
                //e.preventDefault();
               // console.log(imgUl.lightGallery(), $(this), e, "gallery dom");
                imgUl.lightGallery({
                                closable: true,
                                hash:false,
                                share: false,
                                download: false,
                                thumbnail: false,
                            });
               // return false;
            });

            }

        
        };

        


        //Pannellum configuration for the Space tour
        ST.config = {

        "default": {
            "firstScene": "siddiqi_office_hdr",
            "sceneFadeDuration": 2000,
            "autoLoad": true,
            "hfov": 80,
            "autoRotate": -0.4,
            "autoRotateInactivityDelay": 40000,
            "toggleFullscreen": true,
            "showZoomCtrl": true,
            "compass":false
            //"hotSpotDebug": true
        },
        
        "scenes": {
            "siddiqi_office_hdr": {
                "title": "Obaid Siddiqi's Office ",
                "type": "equirectangular",
                "panorama": "panoramas/resized/siddiqi_office_hdr.jpg",
                "hotSpots": [
                    {
                        "pitch": -12,
                        "yaw": 40,
                        "type": "info",
                        "text": "The reprint pile",
                        "URL": "#&q?i=reprints"
                    },
                    {
                        "pitch": -7,
                        "yaw": -140,
                        "type": "info",
                        "text": "On the lookout for trainee students",
                        "URL": "#&q?i=lookout"
                    },
                    {
                        "pitch": 0,
                        "yaw": 190,
                        "type": "scene",
                        "text": "Lab",
                        "sceneId": "1"
                    }
                ]
            },

            "1": {
                "title": "Lab view 1",
                "panorama": "panoramas/resized/1.jpg",
                "yaw": 85,
                "hotSpots": [
                    {
                        "pitch": -1,
                        "yaw": 85,
                        "type": "scene",
                        "text": "Obaid Siddiqi's Office",
                        "sceneId": "siddiqi_office_hdr"
                    },
                    {
                        "pitch": 0,
                        "yaw": 170,
                        "type": "scene",
                        "text": "Lab view 2",
                        "sceneId": "table_legs_hdr"
                    },
                    {
                        "pitch": -1,
                        "yaw": 88,
                        "type": "info",
                        "text": "Fly behaviour in a wind tunnel",
                        "URL": "#&q?i=wind"
                    },
                    {
                        "pitch": 15,
                        "yaw": 17,
                        "type": "info",
                        "text": "Patch clamp lab",
                        "URL": "#&q?i=patch"
                    },
                    {
                        "pitch": 16,
                        "yaw": -158,
                        "type": "info",
                        "text": "Interaction with support staff in Obaid Siddiqi's Lab",
                        "URL": "#&q?i=staff"
                    },
                ]
            },

            "table_legs_hdr": {
                "title": "Lab view 2",
                "panorama": "panoramas/resized/table_legs_hdr.jpg",
                "hotSpots": [
                    {
                        "pitch": 0,
                        "yaw": 50,
                        "type": "scene",
                        "text": "Lab view 1",
                        "sceneId": "1"
                    },
                    {
                        "pitch": 0,
                        "yaw": -50,
                        "type": "scene",
                        "text": "Lab view 3",
                        "sceneId": "2_hdr"
                    },
                    {
                        "pitch": -14,
                        "yaw": 13,
                        "type": "info",
                        "text": "Old electrode puller",
                        "URL": "#&q?i=electrode"
                    },
                    {
                        "pitch": -30,
                        "yaw": -60,
                        "type": "info",
                        "text": "Lab Meetings",
                        "URL": "#&q?i=meetings"
                    }

                ]
            },

            "2_hdr": {
                "title": "Lab view 3",
                "panorama": "panoramas/resized/2_hdr.jpg",
                "yaw":-49,
                "hotSpots": [
                    {
                        "pitch": 0,
                        "yaw": 100,
                        "type": "scene",
                        "text": "Lab view 2",
                        "sceneId": "table_legs_hdr"
                    },
                     {
                        "pitch": 0.1,
                        "yaw": -73,
                        "type": "scene",
                        "text": "Lab view 4",
                        "sceneId": "3_hdr"
                    },
                    {
                        "pitch": 2,
                        "yaw": 20,
                        "type": "info",
                        "text": "Hand drawn graphs and verification of data",
                        "URL": "#&q?i=graphs"
                    },
                    {
                        "pitch": -14,
                        "yaw": -41,
                        "type": "info",
                        "text": "The 1999 flood",
                        "URL": "#&q?i=flood"
                    }
                    
                ]
            },

            "3_hdr": {
                "title": "Lab view 4",
                "panorama": "panoramas/resized/3_hdr.JPG",
                "hotSpots": [
                    {
                        "pitch": 0,
                        "yaw": -100,
                        "type": "scene",
                        "text": "Lab view 3",
                        "sceneId": "2_hdr"
                    },
                    {
                        "pitch": 0.4,
                        "yaw": 7.8,
                        "type": "info",
                        "text": "Student Lab benches",
                        "URL": "#&q?i=benches"
                    },
                    {
                        "pitch": 2,
                        "yaw": -36,
                        "type": "info",
                        "text": "Fly maze apparatus",
                        "URL": "#&q?i=maze"
                    },
                    {
                        "pitch": 2.1,
                        "yaw": -82.9,
                        "type": "info",
                        "text": "Lab Spaces",
                        "URL": "#&q?i=spaces"
                    }

                ]
            }
        }

    };

    //Start App
    ST.init();
    });
