import uniqueid from 'uniqueid';
import Actions from '../../../../src/Actions';

export default class TodoActions extends Actions {

    fetch() {
        // Invoke wait action
        this.wait();

        // Pretend web api call
        setTimeout(() => {
            var data = [
                {id: uniqueid(), title: 'Reimplement flux'},
                {id: uniqueid(), title: 'Drop Backbone'},
                {id: uniqueid(), title: 'Travel'},
            ];
            
            // Invoke complete action
            this.completed(data);
        }, 500);
    }

    wait() {
        this.dispatch('wait');
    }

    completed(data) {
       this.dispatch('completed', data);
    }

    failed(err) {
        this.dispatch('failed', err);
    }

    create(title) {
        this.dispatch('create', title);
    }

    destroy(id) {
        this.dispatch('destroy', id);
    }
}
