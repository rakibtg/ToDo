let toDoApp = new function () {

  // Application states and dom refs.
  this.toDoForm         = document.getElementsByClassName( 'todo-form' )
  this.todoListDOM      = document.getElementById( 'taskcollections' )
  this.toDoItems        = []
  this.renderListOfType = 'all'
  this.todoUpdatable    = null

  // Initialize data in locastorage
  if( ! localStorage.getItem( 'todos' ) ) {
    localStorage.setItem( 'todos', JSON.stringify( [] ) )
  }

  // Render todo's
  this.render = () => {
    let renderableDOM = ''
    let todoStore     = JSON.parse( localStorage.getItem( 'todos' ) )
    todoStore.map( ( todo, index ) => {
      if( this.renderListOfType === 'all' ) {
        // render all todos
        renderableDOM += this.toDoRender( todo, index )
      } else if ( this.renderListOfType === 'completed' ) {
        // render only completed todo
        if( todo.checked === true ) {
          renderableDOM += this.toDoRender( todo, index )
        }
      } else if ( this.renderListOfType === 'active' ) {
        // render todo that are active
        if( todo.checked === false ) {
          renderableDOM += this.toDoRender( todo, index )
        }
      }
    } )
    // console.log( renderableDOM )
    this.todoListDOM.innerHTML = renderableDOM
  }

  // Render each todo
  this.toDoRender = ( todo, index ) => {
    let _rd = ''
    _rd += `
      <div class="task">
        <div class="task-checkbox" onclick="toDoApp.toggleToDoCheckBox( `+index+` )">`
            // Check if todo is checked or not
            if( todo.checked ) {
              _rd += `<div class="ticked">✔</div>`
            } else {
              _rd += `<div class="not-ticked"></div>`
            }
          _rd += `</div>
        <div class="task-label">
          `+todo.title+`
        </div>
        <div class="task-menu" title="Options" onclick="toDoApp.toggleOptions( `+index+` )">⠿</div>
        `+this.renderOptionDOM( index )+`
      </div>
    `
    return _rd
  }

  this.renderOptionDOM = index => {
    return `
      <div class="options hide _op`+index+`" id="_op`+index+`"> 
        <a href="" onclick="toDoApp.edit( event, `+index+` )"><span class="fa fa-pencil"></span> Edit</a>
        <a href="" onclick="toDoApp.delete( event, `+index+` )"><span class="fa fa-trash"></span> Delete</a>
      </div>
    `
  }

  // Add a todo
  this.add = event => {
    event.preventDefault()   
    if( event.target[ 1 ].value === 'Save' ) {
      // Update a todo
      let todoStore = JSON.parse( localStorage.getItem( 'todos' ) )
      todoStore[ this.todoUpdatable ].title = event.target[ 0 ].value
      localStorage.setItem( 'todos', JSON.stringify( todoStore ) )
      event.target[ 0 ].value = ''
      event.target[ 1 ].value = 'Add New Task'
      this.todoUpdatable = null
      this.render()
    } else {
      // Append a new todo, now process todo data type
      let thisToDo = {
        id: Math.random().toString( 36 ).replace( /[^a-z]+/g, '' ).substr( 0, 5 ),
        title: event.target[ 0 ].value,
        checked: false,
      }
      // Empty to do input
      event.target[ 0 ].value = ''
      // Add todo to localstorage
      let todoStore = JSON.parse( localStorage.getItem( 'todos' ) )
      // Updating todo data
      todoStore.push( thisToDo ) 
      // Set new updated todo data
      // Sort todo's
      let todoStoreSorted = todoStore.slice( 0 )
      todoStoreSorted.sort( ( a, b ) => {
        var x = a.title.toLowerCase()
        var y = b.title.toLowerCase()
        return x < y ? -1 : x > y ? 1 : 0
      } )
      localStorage.setItem( 'todos', JSON.stringify( todoStoreSorted ) )
      this.render()
    }
  }

  // Change checkbox according to option
  this.toggleToDoCheckBox = toDoIndex => {
    // process todo data
    let todoStore = JSON.parse( localStorage.getItem( 'todos' ) )
    // Toggle the check bool.
    todoStore[ toDoIndex ].checked = ! todoStore[ toDoIndex ].checked
    // Update localstorage
    localStorage.setItem( 'todos', JSON.stringify( todoStore ) )
    // re-render component
    this.render()
  }

  // To do renderable by type optionss
  this.toDoRenderType = state => {
    // highlight types
    let types = [ 'all', 'completed', 'active' ]
    types.map( t => {
      if( t == state ) {
        document.getElementById( t ).classList.add( 'activetype' )
      } else {
        document.getElementById( t ).classList.remove( 'activetype' )
      }
    } )
    this.renderListOfType = state
    this.render()
  }

  this.toggleOptions = index => {
    setTimeout(function() {
      document.getElementById( '_op'+index ).classList.remove( 'hide' )
    }, 200)
  }

  this.closeToDoOptions = () => {
    let elements = document.getElementsByClassName('options')
    for(var i=0; i<elements.length; i++) { 
      elements[i].classList.add('hide')
    }
  }

  // edit a todo
  this.edit = ( e, index ) => {
    let todoStore = JSON.parse( localStorage.getItem( 'todos' ) )
    e.preventDefault()
    document.getElementById( 'submit' ).value = 'Save'
    document.getElementById( 'task' ).value = todoStore[ index ][ 'title' ]
    this.todoUpdatable = index
  }

  // deletes a todo
  this.delete = ( e, index ) => {
    e.preventDefault()
    let todoStore = JSON.parse( localStorage.getItem( 'todos' ) )
    todoStore.splice( index, 1 )
    localStorage.setItem( 'todos', JSON.stringify( todoStore ) )
    this.render()
  }
}

toDoApp.render()