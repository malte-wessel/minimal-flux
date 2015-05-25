import uniqueid from 'uniqueid';
import Actions from '../../../../src/Actions';

export default class TodoActions extends Actions {

    fetch() {
        this.dispatch('fetch');
        
        // Pretend web api call
        setTimeout(() => {
            var data = [
                {id: uniqueid(), title: 'Reimplement flux'},
                {id: uniqueid(), title: 'Drop Backbone'},
                {id: uniqueid(), title: 'Travel'},
            ];
            // Invoke complete action
            this.fetchSuccess(data);
        }, 500);
    }

    fetchSuccess(data) {
       this.dispatch('fetchSuccess', data);
    }

    fetchError(err) {
        this.dispatch('fetchError', err);
    }

    create(title) {
        this.dispatch('create', title);
    }

    destroy(id) {
        this.dispatch('destroy', id);
    }
}
