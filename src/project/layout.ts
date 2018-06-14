export function restore() {
	return localStorage.layout && JSON.parse(localStorage.layout);
}

export function save(layout) {
	localStorage.setItem('layout', JSON.stringify(layout));
}

export function restorePane(pane) {
	return localStorage[pane.id];
}

export function savePane(pane, type) {
	localStorage[pane.id] = type;
}

export function removePane(pane) {
	localStorage.removeItem(pane.id);
}