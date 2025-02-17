(function (nx) {
    /**
     * NeXt UI base application
     */

    // Calculate topology canvas size
    // based on window size during page loading.
    // Canvas size can only be set once during page init. 
    // It does not autoscale. Page reload is required to update topology dimensions.
    if (document.body.clientWidth && document.body.clientHeight) {
        var canvasWidth = document.body.clientWidth*0.75;
        var canvasHeight = document.body.clientHeight*0.75;
    } else {
        var canvasWidth = 850;
        var canvasHeight = 750;
    };

    // Initialize topology
    var topo = new nx.graphic.Topology({
        // View dimensions
        width: canvasWidth,
        height: canvasHeight,
        // Dataprocessor is responsible for spreading 
        // the Nodes across the view.
        // 'force' dataprocessor spreads the Nodes so
        // they would be as distant from each other
        // as possible. Follow social distancing and stay healthy.
        // 'quick' dataprocessor picks random positions
        // for the Nodes.
        dataProcessor: 'force',
        // Node and Link identity key attribute name
        identityKey: 'id',
        // Node settings
        nodeConfig: {
            label: 'model.name',
            iconType:'model.icon',
            color: function(model) {
                if (model._data.is_new === 'yes') {
                    return '#148D09'
                }
            },
        },
        // Node Set settings (for future use)
        nodeSetConfig: {
            label: 'model.name',
            iconType: 'model.iconType'
        },
        // Tooltip content settings
        tooltipManagerConfig: {
            nodeTooltipContentClass: 'CustomNodeTooltip'
        },
        // Link settings
        linkConfig: {
            // Display Links as curves in case of 
            //multiple links between Node Pairs.
            // Set to 'parallel' to use parallel links.
            linkType: 'curve',
            sourcelabel: 'model.srcIfName',
            targetlabel: 'model.tgtIfName',
            style: function(model) {
                if (model._data.is_dead === 'yes') {
                    return { 'stroke-dasharray': '5' }
                }
            },
            color: function(model) {
                if (model._data.is_dead === 'yes') {
                    return '#E40039'
                }
                if (model._data.is_new === 'yes') {
                    return '#148D09'
                }
            },
        },
        // Display Node icon. Displays a dot if set to 'false'.
        showIcon: true,
        linkInstanceClass: 'CustomLinkClass'
    });
    
    nx.graphic.Icons.registerIcon("dead_node", "/static/nextbox_ui_plugin/img/dead_node.png", 49, 49);
    nx.graphic.Icons.registerIcon("business_desktop_high_end", "/static/nextbox_ui_plugin/img/business_desktop_high_end.svg", 49, 49);
    nx.graphic.Icons.registerIcon("business_desktop_midrange", "/static/nextbox_ui_plugin/img/business_desktop_midrange.svg", 49, 49);
    nx.graphic.Icons.registerIcon("business_desktop_budget", "/static/nextbox_ui_plugin/img/business_desktop_budget.svg", 49, 49);
    nx.graphic.Icons.registerIcon("business_server_tower", "/static/nextbox_ui_plugin/img/business_server_tower.svg", 49, 49);
    nx.graphic.Icons.registerIcon("console_server", "/static/nextbox_ui_plugin/img/console_server.svg", 49, 49);
    nx.graphic.Icons.registerIcon("console_server_serial_port", "/static/nextbox_ui_plugin/img/console_server_serial_port.svg", 49, 49);
    nx.graphic.Icons.registerIcon("docker_host", "/static/nextbox_ui_plugin/img/docker_host.svg", 49, 49);
    nx.graphic.Icons.registerIcon("fiber_cable", "/static/nextbox_ui_plugin/img/fiber_cable.svg", 49, 49);
    nx.graphic.Icons.registerIcon("fruit_allinone", "/static/nextbox_ui_plugin/img/fruit_allinone.svg", 49, 49);
    nx.graphic.Icons.registerIcon("fruit_laptop", "/static/nextbox_ui_plugin/img/fruit_laptop.svg", 49, 49);
    nx.graphic.Icons.registerIcon("fruit_smartphone", "/static/nextbox_ui_plugin/img/fruit_smartphone.svg", 49, 49);
    nx.graphic.Icons.registerIcon("game_console_generic", "/static/nextbox_ui_plugin/img/game_console_generic.svg", 49, 49);
    nx.graphic.Icons.registerIcon("game_console_white_vertical", "/static/nextbox_ui_plugin/img/game_console_white_vertical.svg", 49, 49);
    nx.graphic.Icons.registerIcon("game_console_black_glossy", "/static/nextbox_ui_plugin/img/game_console_black_glossy.svg", 49, 49);
    nx.graphic.Icons.registerIcon("game_console_black_glossy_newer", "/static/nextbox_ui_plugin/img/game_console_black_glossy_newer.svg", 49, 49);
    nx.graphic.Icons.registerIcon("game_console_3d_handheld", "/static/nextbox_ui_plugin/img/game_console_3d_handheld.svg", 49, 49);
    nx.graphic.Icons.registerIcon("game_console_handheld_attached_controllers", "/static/nextbox_ui_plugin/img/game_console_handheld_attached_controllers.svg", 49, 49);
    nx.graphic.Icons.registerIcon("laptop_dock", "/static/nextbox_ui_plugin/img/laptop_dock.svg", 49, 49);
    nx.graphic.Icons.registerIcon("load_balancer", "/static/nextbox_ui_plugin/img/load_balancer.svg", 49, 49);
    nx.graphic.Icons.registerIcon("pdu", "/static/nextbox_ui_plugin/img/pdu.svg", 49, 49);
    nx.graphic.Icons.registerIcon("printer_large", "/static/nextbox_ui_plugin/img/printer_large.svg", 49, 49);
    nx.graphic.Icons.registerIcon("printer_small", "/static/nextbox_ui_plugin/img/printer_small.svg", 49, 49);
    nx.graphic.Icons.registerIcon("robot_smartphone", "/static/nextbox_ui_plugin/img/robot_smartphone.svg", 49, 49);
    nx.graphic.Icons.registerIcon("storage_device_cube", "/static/nextbox_ui_plugin/img/storage_device_cube.svg", 49, 49);
    nx.graphic.Icons.registerIcon("storage_device_rack", "/static/nextbox_ui_plugin/img/storage_device_rack.svg", 49, 49);
    nx.graphic.Icons.registerIcon("ups", "/static/nextbox_ui_plugin/img/ups.svg", 49, 49);
    nx.graphic.Icons.registerIcon("voice_router", "/static/nextbox_ui_plugin/img/voice_router.svg", 49, 49);
    
    var Shell = nx.define(nx.ui.Application, {
        methods: {
            getContainer: function() {
                return new nx.dom.Element(document.getElementById('nx-ui-topology'));
            },
            start: function () {
                // Read topology data from variable
                topo.data(topologyData);
                
                // set initial layer alignment direction
                if (topologyData["nodes"].length > 0 & (initialLayout == 'vertical' | initialLayout == 'horizontal')) {
                    var layout = topo.getLayout('hierarchicalLayout');
                    layout.direction(initialLayout);
                    layout.levelBy(function(node, model) {
                    return model.get('layerSortPreference');
                    });
                    topo.activateLayout('hierarchicalLayout');
                };
                // Attach it to the document
                topo.attach(this);
            }
        }
    });

    nx.define('CustomNodeTooltip', nx.ui.Component, {
        properties: {
            node: {},
            topology: {}
        },
        view: {
            content: [{
                tag: 'div',
                content: [{
                    tag: 'h5',
                    content: [{
                        tag: 'a',
                        content: '{#node.model.name}',
                        props: {"href": "{#node.model.dcimDeviceLink}", "target": "_blank", "rel": "noopener noreferrer"}
                    }],
                    props: {
                        "style": "border-bottom: dotted 1px; font-size:90%; word-wrap:normal; color:#003688"
                    }
                }, {
                    tag: 'p',
                    content: [
                        {
                        tag: 'label',
                        content: 'IP: ',
                    }, {
                        tag: 'label',
                        content: '{#node.model.primaryIP}',
                    }
                    ],
                    props: {
                        "style": "font-size:80%;"
                    }
                },{
                    tag: 'p',
                    content: [
                        {
                        tag: 'label',
                        content: 'Model: ',
                    }, {
                        tag: 'label',
                        content: '{#node.model.model}',
                    }
                    ],
                    props: {
                        "style": "font-size:80%;"
                    }
                }, {
                    tag: 'p',
                    content: [{
                        tag: 'label',
                        content: 'S/N: ',
                    }, {
                        tag: 'label',
                        content: '{#node.model.serial_number}',
                    }],
                    props: {
                        "style": "font-size:80%; padding:0"
                    }
                },
            ],
            props: {
                "style": "width: 150px;"
            }
        }]
        }
    });

    nx.define('Tooltip.Node', nx.ui.Component, {
        view: function(view){
            view.content.push({
            });
            return view;
        },
        methods: {
            attach: function(args) {
                this.inherited(args);
                this.model();
            }
        }
    });

    nx.define('CustomLinkClass', nx.graphic.Topology.Link, {
        properties: {
            sourcelabel: null,
            targetlabel: null
        },
        view: function(view) {
            view.content.push({
                name: 'source',
                type: 'nx.graphic.Text',
                props: {
                    'class': 'sourcelabel',
                    'alignment-baseline': 'text-after-edge',
                    'text-anchor': 'start',
                    "style": "fill: #8d092a"
                }
            }, {
                name: 'target',
                type: 'nx.graphic.Text',
                props: {
                    'class': 'targetlabel',
                    'alignment-baseline': 'text-after-edge',
                    'text-anchor': 'end',
                    "style": "fill: #8d092a"
                }
            });
            
            return view;
        },
        methods: {
            update: function() {
                
                this.inherited();
                var el, point;
                var line = this.line();
                var angle = line.angle();
                var stageScale = this.stageScale();
                
                // pad line
                line = line.pad(18 * stageScale, 18 * stageScale);
                
                if (this.sourcelabel()) {
                    el = this.view('source');
                    point = line.start;
                    el.set('x', point.x);
                    el.set('y', point.y);
                    el.set('text', this.sourcelabel());
                    el.set('transform', 'rotate(' + angle + ' ' + point.x + ',' + point.y + ')');
                    el.setStyle('font-size', 11 * stageScale);
                }
                
                
                if (this.targetlabel()) {
                    el = this.view('target');
                    point = line.end;
                    el.set('x', point.x);
                    el.set('y', point.y);
                    el.set('text', this.targetlabel());
                    el.set('transform', 'rotate(' + angle + ' ' + point.x + ',' + point.y + ')');
                    el.setStyle('font-size', 11 * stageScale);
                }
            }
        }
    });

    var currentLayout = initialLayout;

    horizontal = function() {
        if (currentLayout === 'horizontal') {
            return;
        };
        if (topo.graph().getData()["nodes"].length < 1) {
            return;
        };
        currentLayout = 'horizontal';
        var layout = topo.getLayout('hierarchicalLayout');
        layout.direction('horizontal');
        layout.levelBy(function(node, model) {
            return model.get('layerSortPreference');
        });
        topo.activateLayout('hierarchicalLayout');
    };

    vertical = function() {
        if (currentLayout === 'vertical') {
            return;
        };
        var currentTopoData = topo.graph().getData();
        if (currentTopoData < 1) {
            return;
        };
        currentLayout = 'vertical';
        var layout = topo.getLayout('hierarchicalLayout');
        layout.direction('vertical');
        layout.levelBy(function(node, model) {
          return model.get('layerSortPreference');
        });
        topo.activateLayout('hierarchicalLayout');
    };
    showHideUndonnected = function() {
        let unconnectedNodes = []
        topologyData['nodes'].forEach(function(node){
            var isUnconnected = true
            topologyData['links'].forEach(function(link){
                if (link['source'] === node['id'] | link['target'] === node['id']) {
                    isUnconnected = false;
                    return;
                };
            });
            if (isUnconnected == true) {
                unconnectedNodes.push(node['id'])
            };
        });

        if (unconnectedNodes.length > 0) {
            unconnectedNodes.forEach(function(nodeID) {
                topo.graph().getVertex(nodeID).visible(displayUnconnected);
            });
            displayUnconnected = !displayUnconnected;
        };
    };

    showHideDeviceRoles = function(deviceRole, isVisible) {
        let devicesByRole = []
        topologyData['nodes'].forEach(function(node){
            if (node['deviceRole'] == deviceRole) {
                topo.graph().getVertex(node['id']).visible(isVisible);
            };
        });
    };

    showHideDevicesByTag = function(deviceTag, isVisible) {
        topologyData['nodes'].forEach(function(node){
            if (node['tags'].length < 1) {
                return;
            };
            node['tags'].forEach(function(tag){
                if (tag == deviceTag) {
                    topo.graph().getVertex(node['id']).visible(isVisible);
                    return;
                };
            });
        });
    };

    showHideLogicalMultiCableLinks = function() {
        topologyData['links'].forEach(function(link){
            if (link['isLogicalMultiCable']) {
                topo.getLink(link['id']).visible(displayLogicalMultiCableLinks);
            };
        });
        displayLogicalMultiCableLinks = !displayLogicalMultiCableLinks
    };

    showHidePassiveDevices = function() {
        topologyData['nodes'].forEach(function(node){
            if ('isPassive' in node) {
                if (node['isPassive']) {
                    topo.graph().getVertex(node['id']).visible(displayPassiveDevices);
                };
            };
        });
        displayPassiveDevices = !displayPassiveDevices
    };

    saveView = function (topoSaveURI, CSRFToken) {
        var topoSaveName = document.getElementById('topoSaveName').value.trim();
        var saveButton = document.getElementById('saveTopologyView');
        var saveResultLabel = document.getElementById('saveResult');
        saveButton.setAttribute('disabled', true);
        saveResultLabel.setAttribute('innerHTML', 'Processing');
        $.ajax({
            type: 'POST',
            url: topoSaveURI,
            data: {
                'name': topoSaveName,
                'topology': JSON.stringify(topo.data()),
                'layout_context': JSON.stringify({
                    'initialLayout': initialLayout,
                    'displayUnconnected': !displayUnconnected,
                    'undisplayedRoles': undisplayedRoles,
                    'undisplayedDeviceTags': undisplayedDeviceTags,
                    'displayPassiveDevices': !displayPassiveDevices,
                    'displayLogicalMultiCableLinks': displayLogicalMultiCableLinks,
                    'requestGET': requestGET,
                })
            },
            headers: {'X-CSRFToken': CSRFToken},
            success: function (response) {
                saveResultLabel.innerHTML = 'Success';
                saveButton.removeAttribute('disabled');
                console.log(response);
            },
            error: function (response) {
                saveResultLabel.innerHTML = 'Failed';
                console.log(response);
            }
        })
    };

    topo.on('topologyGenerated', function(){
        showHideUndonnected();
        showHidePassiveDevices();
        if (displayPassiveDevices) {
            displayLogicalMultiCableLinks = true;
        };
        showHideLogicalMultiCableLinks();
        undisplayedRoles.forEach(function(deviceRole){
            showHideDeviceRoles(deviceRole, false);
        });
        undisplayedDeviceTags.forEach(function(deviceTag){
            showHideDevicesByTag(deviceTag, false);
        });
        topologySavedData['nodes'].forEach(function(node){
            topo.graph().getVertex(node['id']).position({'x': node.x, 'y': node.y});
        });
    });

    // Create an application instance
    var shell = new Shell();
    shell.on('resize', function() {
        topo && topo.adaptToContainer();
    });
    // Run the application
    shell.start();
})(nx);

