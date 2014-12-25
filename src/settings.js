var Settings = React.createClass({
    getInitialState: function() {
        if(localStorage.settings) {
            return JSON.parse(localStorage.settings);
        }
        //initial settings, if no saved settings in localStorage
        return { 
            font: "traditional",
            activeModules: Object.keys(this.props.allModules),
            mode: 'thai-prompt',
            starMode: false,
            clearStars: false
        };
    },
    componentDidUpdate: function() {
        localStorage.settings = JSON.stringify(this.state);
    },
    componentDidMount: function() {
        // emit initial settings
        this.props.onSettingChanged(this.state);
    },
    formElementChanged: function(e) {
        var changeSet = util.readFormChangeFromEvent(e);
        this.setState(changeSet);
        this.props.onSettingChanged(changeSet);
    },
    clearStars: function(e) {
        this.props.onSettingChanged({clearStars: true});
        this.setState({starMode: false});
    },
    render: function() {
        var options = [];
        for(var key in this.props.allModules) {
            options.push(<option key={key} value={key}>{key}</option>);
        }
        options.sort(function(o1, o2) { return o1.key > o2.key; });

        return (
            <div id="settings" onChange={this.formElementChanged}>
                <a className="close" href="#">X</a>
                <div className="right-column">
                    <h1>Starred Cards</h1>
                    <label><input onChange={this.formElementChanged} type="checkbox" name="starMode" checked={this.state.starMode} />Show only starred cards</label>
                    <button name="clearStars" onClick={this.clearStars}>Clear all starred cards</button>
                    <h1>Card Topics</h1>
                    <select name="activeModules" multiple value={this.state.activeModules} size="6">
                        {options}
                    </select>
                </div>
                <div className="left-column">
                    <h1>Mode</h1>
                    <label><input type="radio" name="mode" value="thai-prompt" defaultChecked={this.state.mode === 'thai-prompt'}  /> Thai &rarr; English</label>
                    <label><input type="radio" name="mode" value="english-prompt" defaultChecked={this.state.mode === 'english-prompt'} /> English &rarr; Thai</label>
                    <h1>Thai Font</h1>
                    <label><input type="radio" name="font" value="traditional" defaultChecked={this.state.font === 'traditional'} />Traditional</label>
                    <label><input type="radio" name="font" value="modern" defaultChecked={this.state.font === 'modern' } />Modern</label>
                </div>
            </div>
        )
    }
});
