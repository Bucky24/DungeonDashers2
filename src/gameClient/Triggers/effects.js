import store from '../store';

import { Panes, setUIPane } from '../store/ducks/ui';

export const winGame = () => {
	store.dispatch(setUIPane(Panes.WON_GAME));
}