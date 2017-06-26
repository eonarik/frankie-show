import React, { Component, createElement } from 'react';

import LayoutInner from 'tpl/mobile/Layout/LayoutInner';

import Walkman from 'tpl/mobile/blocks/Walkman';
import Player from 'tpl/mobile/blocks/Player';

import AlbumsList from 'tpl/mobile/inc/AlbumsList';
import Album from 'tpl/mobile/inc/Album';
import TextPage from 'tpl/mobile/inc/TextPage';
import Lyrics from 'tpl/mobile/inc/Lyrics';
import Track from 'tpl/mobile/inc/Track';
import LayoutAuth from './LayoutAuth';

import LoadMask from 'cmp/LoadMask';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';

import { ltrim } from 'cmp/functions';

let request = require('cmp/request');;

const routing = {
    // texts
    1: {
        tpl_id: 1,
        tpl: TextPage,
    },
    // album
    2: {
        tpl_id: 2,
        tpl: Album,
    },
    // track
    3: {
        tpl_id: 3,
        tpl: Track,
    },
    // album list
    4: {
        tpl_id: 4,
        tpl: AlbumsList,
    },
    // playlist
    5: {
        tpl_id: 5,
        tpl: Album,
    },
    // lyrics
    7: {
        tpl_id: 7,
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
    }

    static propTypes = {
        walkmanActive: React.PropTypes.bool.isRequired,
        loading: React.PropTypes.bool.isRequired,
    }

    state = {
        menu: {},
        page: {},
    }

    constructor(props) {
        super(props);

        this.updateContent(window.location.pathname);

        // отреагируем на кнопки истории
        window.onpopstate = (event) => {
            if (event.state && event.state.type) {
                this.updateContent(event.state.page);
            }
        };

        // окончание воспроизведения
        audio.addEventListener('ended', () => props.next());

        /*
			информация о юзере
		*/
        request('users/get_own_data', {}, (r) => {
            this.props.setUserInfo(r.object);
        });

        let self = this;
        $(document).on('click', 'a[href]', function (e) {
            var a = $(this);
            var href = a.attr('href');
            if (
                href
                && href.indexOf('#') !== 0
                && href.indexOf('javascript') < 0
                && href.indexOf('mailto') < 0
            ) {
                self.updateContent(href);

                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });
    }

    componentDidMount() {
        // активируем все события MDL
        componentHandler.upgradeElements(document.querySelectorAll('[className*=mdl-js-]'));
    }

    updateContent(href) {
        this.props.startLoading();

        request('get/content', {
            uri: href != '/' ? ltrim(href, '/') : href,
        }, (r) => {
            let object = r.object;
            routeItem = routing[object.template];

            let Tpl = routeItem.tpl;

            if (object.template == 2) {
                this.props.setPlaylist(object.props.playlists, object.id);
            }

            let content = <Tpl page={object} />;
            this.props.setContent(content);

            // title tag
            document.getElementsByTagName('title')[0].text = object.pagetitle + ' | Фрэнки-шоу';

            this.setState({
                menu: object.menu,
            });

            this.props.walkmanToggle(false);

            // работа с историей
            if (window.location.href != href) {
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

    toggleActive() {
        this.props.walkmanToggle(!this.props.walkmanActive);
    }

    render() {
        const mainMenu = this.state.menu.main || null;
        return (
            <LayoutInner>
                <section className="_head">
                    {mainMenu ?
                        mainMenu.map((item, i) => (
                            <a key={i} href={item.uri}
                                className={'mdl-button mdl-js-button mdl-js-ripple-effect _head__button' + (item.active ? ' _head__button--active' : '')}>
                                <i className="material-icons" rel="noindex">{item.link_attributes}</i>
                            </a>
                        ))
                        : null}

                    <a href="javascript:;"
                        className='mdl-button mdl-js-button mdl-js-ripple-effect _head__button'>
                        <i className="material-icons" rel="noindex">search</i>
                    </a>

                    <LayoutAuth />
                </section>

                <section className="_content">
                    <LoadMask show={this.props.loading} />

                    <div className="_content__inside">

                        {this.props.content}
                    </div>
                </section>

                <Walkman
                    walkmanActive={this.props.walkmanActive}
                />

                <Player
                    walkmanActive={this.props.walkmanActive}
                    toggleActive={this.toggleActive.bind(this)}
                />

            </LayoutInner>
        );
    }
}

function mapStateToProps(state) {
    console.log(state)
    state = {
        walkmanActive: state.layout.walkmanActive,
        loading: state.layout.loading,
        content: state.player.content,
    };
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        walkmanToggle: bindActionCreators(Actions.walkmanToggle, dispatch),
        setContent: bindActionCreators(Actions.setContent, dispatch),
        setPlaylist: bindActionCreators(Actions.setPlaylist, dispatch),
        next: bindActionCreators(Actions.next, dispatch),
        startLoading: bindActionCreators(Actions.startLoading, dispatch),
        endLoading: bindActionCreators(Actions.endLoading, dispatch),
        setUserInfo: bindActionCreators(Actions.setUserInfo, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
