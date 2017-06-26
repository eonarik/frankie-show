import React, { Component } from 'react';

export default class LayoutRight extends Component {
	render(){
		return (
			<div className="aside aside--right">
				<div className="mdl-card mdl-shadow--2dp infoblock">
					<div className="mdl-card__title infoblock__header">
						<div className="mdl-card__title-text infoblock__title">Обновление сайта frankie-show.ru!</div>
					</div>
					<div className="mdl-card__supporting-text infoblock__body">
						<p>Добро пожаловать, фанат Сумасшедшего Френки!</p>
						<p>На нашем сайте ты найдешь свои любимые выпуски Френки шоу.</p>
						<p>О найденных ошибках и предложениях для улучшения сайта, пиши сюда - <a href="mailto:frankie.show@yandex.ru">frankie.show@yandex.ru</a></p>
					</div>
				</div>
			</div>
		);
	}
}