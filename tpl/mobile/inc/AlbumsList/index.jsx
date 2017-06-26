import React, { Component } from 'react';

export class AlbumListItem extends Component {
    render() {
        const item = this.props.item;
        return (
            <div key={item.id} className="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--2-col-phone">
                <div className="demo-card-wide mdl-card mdl-shadow--2dp _album__card">
                    <div className="mdl-card__title _album__image-box">
                        <img src={item.image || this.props.defaultImage} alt={item.pagetitle} />
                        <a href={item.uri} className="_album__link-box">
                            <span>The Best</span>
                            <i className="material-icons" rel="noindex">play_arrow</i>
                            <span>{item.menutitle ? item.menutitle : item.pagetitle}</span>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default class AlbumList extends Component {
    render() {
        const page = this.props.page;
        const data = page.props.albums;

        var albumsTpl = data.map(function (item, index) {
            return <AlbumListItem key={item.id} item={item} defaultImage={page.album_default_image_mobile} />;
        });

        return (
            <div className="_album">
                <div className="mdl-grid">
                    {albumsTpl}
                </div>
            </div>
        );
    }
}
