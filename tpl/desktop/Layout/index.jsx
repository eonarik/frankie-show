import React, { Component, createElement } from 'react';
import Snackbar from 'material-ui/Snackbar';

import LayoutHead from './LayoutHead';
import LayoutCarte from './LayoutCarte';
import LayoutRight from './LayoutRight';

import Player from 'tpl/desktop/Player';
import AlbumsList from 'tpl/desktop/inc/AlbumsList';
import Album from 'tpl/desktop/inc/Album';
import TextPage from 'tpl/desktop/inc/TextPage';
import Track from 'tpl/desktop/inc/Track';
import Lyrics from 'tpl/desktop/inc/Lyrics';

import LoadMask from 'cmp/LoadMask';

import { bindActionCreators } from 'redux';
import { connect    } from 'react-redux';
import * as Actions from 'app/actions';

import { ltrim } from 'cmp/functions';

let request = require('cmp/request');

const routing = {
	// texts
 	1 : {
        tpl_id: 1,
        tpl: TextPage,
	},
	// album
    2 : {
        tpl_id: 2,
        tpl: Album,
    },
	// track
    3 : {
        tpl_id: 3,
        tpl: Track,
    },
	// album list
    4: {
        tpl_id: 4,
        tpl: AlbumsList,
    },
	// playlist
    5 : {
        tpl_id: 5,
        tpl: Album,
    },
	// lyrics
    7 : {
        tpl_id: 5,
        tpl: Lyrics,
    },
};

var routeItem = routing[0];
var $ = require('jquery');

class Layout extends Component {

    static defaultProps = {
		walkmanActive: false,
		loading: false,
		content: null,
		alertMessage: '',
	}
	
	static propTypes = {
		walkmanActive: 	React.PropTypes.bool.isRequired,
		loading: 		React.PropTypes.bool.isRequired,
	}
	
	state = {
		activeMainMenuItem: 0,
		menu: [],
		showMessage: false,
	}	

    constructor(props){
		super(props); 
		
        this.updateContent(window.location.pathname);

        // отреагируем на кнопки истории
        window.onpopstate = (event) => {
            if(event.state && event.state.type) {
                this.updateContent(event.state.page);
            }
        };

		/*
			информация о юзере
		*/
		request('users/get_own_data', {}, (r) => {
			this.props.setUserInfo(r.object);
		});

		// окончание воспроизведения
        audio.addEventListener('ended', () => props.next());

		let self = this;
        $(document).on('click','a[href]',function(e){
            var a = $(this);
            var href = a.attr('href');
            if(
				href
				&& href.indexOf('#') !== 0
				&& href.indexOf('javascript') < 0
				&& href.indexOf('mailto') < 0
			){
                self.updateContent(href);

                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });
    }
	
	componentDidMount(){
		// активируем все события MDL
        componentHandler.upgradeElements(document.querySelectorAll('[className*=mdl-js-]'));
	}

    updateContent(href){
		this.props.startLoading();
		href = '/' + ltrim(href, '/');

        request('get/content', {
            uri: href != '/' ? ltrim(href, '/') : href,
        }, (r) => {
            let object = r.object;
            routeItem = routing[object.template];

            let Tpl = routeItem.tpl;

            if(
				object.template == 2
				|| object.template == 3
			){
                this.props.setPlaylist(object.props.playlists, object.id);
            }

            let content = <Tpl Layout={this} page={object} />;
			if(content){
				this.props.setContent(content);
			}
			
			// title tag
			document.getElementsByTagName('title')[0].text = object.pagetitle +' | Фрэнки-шоу';
			
			this.setState({
				menu: object.menu,
			});

            /* this.props.walkmanToggle(false); */

            // работа с историей
            if(window.location.pathname != href){
                history.pushState({
                    page: href,
                    type: "page"
                }, object.pagetitle, href);
            }
			
			this.props.endLoading();
        }, (e) => {
            this.props.endLoading();
        });
    }

    toggleActive(){
        this.props.walkmanToggle(!this.props.walkmanActive);
    }
	
	_handleRequestClose = () => {
		this.setState({
			showMessage: false,
		});
	};

    render(){
        return (
			<div className="mdl-layout mdl-js-layout mdl-layout--fixed-header global__wrapper-flex">
				<LayoutHead Layout={this} />
				
				<section className="content">
					
					<LayoutCarte
						menu={this.state.menu} />

					<div className="inside">
						<LoadMask show={this.props.loading} position='absolute' />
						
						{this.props.content}
					</div>
					
					<LayoutRight />
				</section>
				
				<Player />

				{/*<Snackbar
					open={this.props.alertMessage || this.state.showMessage}
					message={this.props.alertMessage}
					autoHideDuration={4000}
					onRequestClose={this._handleRequestClose.bind(this)}
				/>*/}
			</div>
        );
    }
}

function mapStateToProps(state){
    console.log(state)
	state = {
        walkmanActive: state.layout.walkmanActive,
        loading: state.layout.loading,
        content: state.player.content,
		alertMessage: state.layout.alertMessage,
    };
    return state;
}

function mapDispatchToProps(dispatch){
    return {
        walkmanToggle: bindActionCreators(Actions.walkmanToggle, dispatch),
        setContent: bindActionCreators(Actions.setContent, dispatch),
        setPlaylist: bindActionCreators(Actions.setPlaylist, dispatch),
        next: bindActionCreators(Actions.next, dispatch),
        startLoading: bindActionCreators(Actions.startLoading, dispatch),
        endLoading: bindActionCreators(Actions.endLoading, dispatch),
		showMessage: bindActionCreators(Actions.showMessage, dispatch),
		setUserInfo: bindActionCreators(Actions.setUserInfo, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
