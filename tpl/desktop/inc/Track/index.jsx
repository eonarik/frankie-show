import React from 'react';
import { Album } from 'tpl/desktop/inc/Album';
import AlbumTrack from 'tpl/desktop/inc/Album/AlbumTrack';
import Comments from 'tpl/desktop/inc/Comments';

import Checkbox from 'material-ui/Checkbox';
import IconActionFavorite from 'material-ui/svg-icons/action/favorite';
import IconActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import { Tabs, Tab } from 'material-ui/Tabs';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';

const request = require('cmp/request');

class Track extends Album {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'comments',
            likes: props.page.count_likes || 0,
            isLike: props.page.is_like || false,
        }
    }

    setTab = (tab) => {
        this.setState({
            activeTab: tab,
        })
    }

    _handleLikeCheck = () => {
        const check = this.state.isLike;

        request('ajax/like', {
            resource_id: this.props.page.id,
            active: !check,
        }, (r) => {
            this.setState({
                likes: r.object.total,
                isLike: r.object.active,
            });
        });
    }

    render() {
        let page = this.props.page;
        let data = page.props.playlists;

        var tracksTpl = data.map((item, index) => {
            var active = this.props.track && this.props.track.id == item.id;
            var canPlay = active && this.props.canPlay;
            return (
                <AlbumTrack
                    key={item.id}
                    index={index}
                    active={active}
                    canPlay={canPlay}
                    item={item}
                    togglePlay={this.togglePlay.bind(this)} />
            );
        });

        return (
            <div className="playlist">
                <div className="playlist__header">
                    <div className="playlist__background-box playlist__background-box--blur"
                        style={{
                            backgroundImage: `url('${page.image}')`
                        }}></div>
                    <div className="playlist__title-box">
                        <div className="playlist__header-image-box">
                            <img src={page.image} alt={page.pagetitle} />
                        </div>
                        <div className="rate">
                            <Checkbox
                                ref='like'
                                checkedIcon={<IconActionFavorite />}
                                uncheckedIcon={<IconActionFavoriteBorder />}
                                onCheck={this._handleLikeCheck}
                                checked={this.state.isLike}
                            />
                            <span>{this.state.likes}</span>
                        </div>
                        <h1 className="playlist__title">{page.pagetitle}</h1>

                        {page.albums.length &&
                            <ul className="playlist__albums-list">
                                {page.albums.map((item, i) => (
                                    <li>
                                        {item.current
                                            ? <span>{item.pagetitle}</span>
                                            : <a href={item.uri}>{item.pagetitle}</a>
                                        }
                                    </li>
                                ))}
                            </ul>
                        }
                    </div>
                </div>

                <div className="playlist__box">

                    <ul className="playlist__list js-apl">
                        {tracksTpl}
                    </ul>

                    <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">

                        <Tabs
                            onChange={this.setTab.bind(this)}
                            value={this.state.activeTab}
                            tabItemContainerStyle={{
                                background: 'none',
                            }}
                            inkBarStyle={{
                                backgroundColor: '#3f51b5',
                            }}
                        >
                            <Tab label="Комментарии" value="comments">
                                <Comments
                                    resourceId={page.id}
                                    comments={page.comments} />
                            </Tab>
                            <Tab label="Вики" value="wiki">
                            // wiki
                            </Tab>
                            {page.content &&
                                <Tab label="Текст передачи" value="text">
                                    <div className="program-text" dangerouslySetInnerHTML={{ __html: page.content }} />
                                </Tab>
                            }
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        track: state.audio.track,
        canPlay: state.audio.canPlay,
        currentPlaylist: state.audio.currentPlaylist,
        user: state.user.info,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        play: bindActionCreators(Actions.play, dispatch),
        pause: bindActionCreators(Actions.pause, dispatch),
        setCurrentPlaylist: bindActionCreators(Actions.setCurrentPlaylist, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Track);