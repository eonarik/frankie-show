import React, { Component } from 'react';

class LyricsItem extends Component {
    render() {
        const item = this.props.item;
        return (

            <div className="mdl-cell mdl-cell--3-col">
                <div className="demo-card-wide mdl-card mdl-shadow--2dp album__card">
                    <div className="mdl-card__title album__image-box">
                        <img src={item.image || this.props.defaultImage} alt={item.pagetitle} />
                    </div>
                    <div className="mdl-card__actions album__card-actions">
                        <a href={item.uri} className="mdl-button mdl-button--color-text-light mdl-js-button mdl-js-ripple-effect">
                            {item.menutitle ? item.menutitle : item.pagetitle}
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