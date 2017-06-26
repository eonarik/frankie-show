import React, { Component } from 'react';

class LyricsItem extends Component {
    render(){
        const item = this.props.item;
        return (
            <div key={item.id} className="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--2-col-phone">
                <div className="demo-card-wide mdl-card mdl-shadow--2dp _album__card">
                    <div className="mdl-card__title _album__image-box">
                        <img src={item.image || this.props.defaultImage} alt={item.pagetitle} />
                        <a href={item.uri} className="_album__link-box" style={{
                            justifyContent: 'flex-end',
                            background: 'none',
                        }}>
                            <span style={{
                                padding: 8,
                            }}>{item.menutitle ? item.menutitle : item.pagetitle}</span>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default class Lyrics extends Component {
    render() {
        const page = this.props.page;
        const data = page.props.tracks;

        var tracksTpl = data.map(function (item, index) {
            return <LyricsItem key={item.id} item={item} defaultImage={page.album_default_image_mobile} />;
        });

        return (
            <div className="_album">
                <div className="mdl-grid">
                    {tracksTpl}
                </div>
            </div>
        );
    }
}