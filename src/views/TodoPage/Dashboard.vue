<template>
    <div class="dashContainer">
        <div class="dashAside">
            <div>
                <span class="category">Categorias</span>
                <ul class="catList">
                    <li v-for="(item, index) in categories" :key="index" class="catItem" @click="selectCategory(item.name)"
                    :class="item.name === selectedCategory ? 'selected' : ''">
                        <i class="fas fa-chevron-right"></i>
                        <span class="catName">{{item.name}}</span>
                        <span v-if="item.chip && item.chip.amount" class="catChip" :class="item.chip.color">
                            <span >{{item.chip.amount}}</span>
                        </span>
                    </li>
                </ul>

                <div class="catListMobile" :class="catMenuOpen ? 'open' : ''" @click="catMenuOpen = !catMenuOpen">
                    <div class="header">
                        <span>{{ this.selectedCategory }}</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="dropdown-content">
                        <ul>
                            <li v-for="(item, index) in categories" :key="index" class="catItem" @click="selectCategory(item.name)"
                                :class="item.name === selectedCategory ? 'selected' : ''"
                            >
                                <i class="fas fa-chevron-right"></i>
                                <span class="catName">{{item.name}}</span>
                                
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
        <div class="dashMain">
            <div class='dashContent'>
                <h3>Minhas Tarefas</h3>
                <p>Olá <span class="username">{{$store.state.user.username}}</span>, você
                    <span v-if="!notDoneAmount"> não tem <span class="taskAmount">nenhuma tarefa</span> pendente!</span>
                    <span v-else-if="notDoneAmount === 1">tem <span class="taskAmount">{{notDoneAmount}} tarefa</span> pendente.</span>
                    <span v-else>tem <span class="taskAmount">{{notDoneAmount}} tarefas</span> pendentes.</span>
                </p>
                    
                <b-input class="search" icon="fas fa-search" v-model="searchInput" @input="filterNotes()"/>
                <Note v-for="note  in currentNotes" :key="note.id+'.'+listKey" :note="note" class="userNote" 
                    @check="toggleNoteStatus" @edit="getNoteToEdit" @delete="getNoteToDelete"
                />
                <div class="divBtnNew">
                    <button class="btn green round btnNew" @click="showEditModal = true">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            
            <b-modal v-if="showEditModal" width="660px">
                <div slot="body" class="editNoteModal">
                    <i @click="closeEditModal()" class='modalCloseBtn fas fa-times'></i>
                    <h3 v-if="selectedNote.id">Editar Tarefa</h3>
                    <h3 v-else>Cadastrar Tarefa</h3>
                    <b-input  class="note" v-model="selectedNote.title"></b-input>
                    <b-input tag="textarea" label="Descrição:" class="description" v-model="selectedNote.description"></b-input>
                    <div class="footer">
                        <div>
                            <div class="divRadio" :class="selectedNote.category === 'Urgente' ? 'selected' : ''" 
                                @click="setSelectedNoteCategory('Urgente')"
                            >
                                <span class="outer"></span>
                                <span class="inner"></span>
                                <span class="label">Urgente</span>
                            </div>

                            <div class="divRadio" :class="selectedNote.category === 'Importante' ? 'selected' : ''" 
                                @click="setSelectedNoteCategory('Importante')"
                            >
                                <span class="outer"></span>
                                <span class="inner"></span>
                                <span class="label">Importante</span>
                            </div>
                        </div>
                        <button v-if="selectedNote.id" class="btn green" :disabled="!selectedNote.title"
                            @click="saveNote()"
                        >
                            Editar
                        </button>
                        <button v-else class="btn green" :disabled="!selectedNote.title"
                            @click="saveNote()"
                        >Adicionar</button>
                    </div>    
                </div>
            </b-modal>

            <b-modal v-if="showDelModal" width="477px">
                <div slot="body" class="delNoteModal">
                    <div class="bigIcon">
                        <i class="far fa-trash-alt"></i>
                    </div>
                    <p>Tem certeza que deseja excluir esta tarefa?</p>
                    <span>Esta ação não poderá ser desfeita.</span>
                    <div>
                        <button class="btn green" @click="closeDelModal()">Cancelar</button>
                        <button class="btn red" @click="deleteNote()">Confirmar</button>
                    </div>
                </div>
            </b-modal>
        </div>
    </div>
</template>

<script>
    import BrInput from '../../components/BrInput.vue'
    import Note from '../../components/Note.vue'
    import Modal from '../../components/Modal.vue'
    
    const noteInitialState = {
        done: false,
        category: '',
        title: '',
        description: '',
        updatedAt: ''
    }
    
    export default {
        name: 'DashBoard',
        components: {
            'b-input': BrInput,
            Note,
            'b-modal': Modal,
        },

        data(){
            return {
                categories: [
                    {
                        name: 'Todas',
                    },
                    {
                        name: 'Urgentes',
                        chip: {
                            color: 'red',
                            amount: 0
                        }
                    },
                    {
                        name: 'Importantes',
                        chip: {
                            color: 'yellow',
                            amount: 0
                        },
                    },
                    {
                        name: 'Outras',
                    },
                    {
                        name: 'Finalizadas',
                    },
                ],
                showDelModal: false,
                showEditModal: false,
                notes: [],
                currentNotes: [],
                selectedCategory: 'Todas',
                searchInput: '',
                selectedNote: {...noteInitialState},
                listKey: 1, // usado pra forçar update na lista de notas
                catMenuOpen: false
            }
        },

        beforeMount(){
            this.getNotes()
        },
        
        computed: {
            urgentAmount(){
                return this.notes.filter(el => el.category === 'Urgente').length
            },
            importantAmount(){
                return this.notes.filter(el => el.category === 'Importante').length
            },
            notDoneAmount(){
                return this.notes.filter(el => !el.done).length
            },
            tasksAmount(){
                return this.notes.length
            }
        },

        methods: {
            getNotes(){
                this.notes =  this.$store.state.notes.filter(el => el.userId === this.$store.state.user.id) // armazena todas as tarefas
                this.countCategory() // Conta quantas tarefas são 'Urgente' e 'Importante'
                this.filterNotes() // armazena e lida com as tarefas que são mostradas                
                ++this.listKey
            },

            countCategory(){
                let urgentes = 0
                let importantes = 0
                this.notes.forEach(el => {
                    if(el.category === 'Urgente')
                        ++urgentes
                    if(el.category === 'Importante')
                        ++importantes
                })
                this.categories[1].chip.amount = urgentes
                this.categories[2].chip.amount = importantes
            },

            // ordena a lista de tarefas pela data e, se categoria 'Todas', pela categoria.
            sortNoteList(){
                this.currentNotes.sort(this.compareByDate)
                if(this.selectedCategory === 'Todas')
                    this.currentNotes.sort(this.compareByCategory)
            },

            compareByCategory(a, b) {
                if(a.category === b.category)
                    return 0

                if (a.category === 'Urgente')
                    return -1			
                if (b.category === 'Urgente')
                    return 1

                if (a.category === 'Importante')
                    return -1			
                if (b.category === 'Importante')
                    return 1
            },

            compareByDate(a, b) {
                if ( a.updatedAt < b.updatedAt )
                    return -1			
                if ( a.updatedAt > b.updatedAt )
                    return 1			
                return 0			
            },

            selectCategory(name){
                this.selectedCategory = name
                this.filterNotes()
            },
            updateTasksList(){
                // baseado no input e na selectedCategory filtra na store
            },

            getNoteToEdit(note){
                this.selectedNote = {...note}
                this.showEditModal = true
            },

            getNoteToDelete(note){
                this.selectedNote = note
                this.showDelModal = true
            },

            deleteNote(){
                this.showDelModal = false
                this.$store.commit('deleteNote', this.selectedNote.id)
                this.selectedNote = {...noteInitialState}
                this.getNotes()
            },
            editNote(){                
                this.$state.commit('updateNote', this.selectedNote)
                this.notes = [...this.$store.state.users[0].notes]
                // roda o filtro
                
            },
            closeEditModal(){
                this.selectedNote = {...noteInitialState}
                this.showEditModal = false
            },
            
            setSelectedNoteCategory(name){
                if(name === this.selectedNote.category)
                    this.selectedNote.category = ''
                else this.selectedNote.category = name
            },
            closeDelModal(){
                this.selectedNote = {...noteInitialState}
                this.showDelModal = false
            },

            // Filtra a lista de notas pela categoria selecionada e pela string digitada no input
            filterNotes(){
                this.filterNotesByCategory()
                this.filterNotesByString()
                this.sortNoteList()
            },

            filterNotesByCategory(){
                switch(this.selectedCategory){
                    case 'Todas':
                        this.currentNotes = [...this.notes]
                        break
                    case 'Urgentes':
                        this.currentNotes = this.notes.filter(el => el.category === 'Urgente')
                        break
                    case 'Importantes':
                        this.currentNotes = this.notes.filter(el => el.category === 'Importante')
                        break
                    case 'Outras':
                        this.currentNotes = this.notes.filter(el => el.category === '')
                        break
                    case 'Finalizadas':
                        this.currentNotes = this.notes.filter(el => el.done)
                        break
                }
            },

            filterNotesByString(){
                if(this.searchInput){
                    this.currentNotes = this.currentNotes.filter(el => el.title.includes(this.searchInput) ||  el.description.includes(this.searchInput))
                }
            },

            toggleNoteStatus(note){
                note.done = !note.done
                this.$store.commit('updateNote', note)
                this.getNotes()
            },

            saveNote(){
                this.showEditModal = false
                if(this.selectedNote.id){ // UPDATE
                    this.selectedNote.updatedAt = new Date().getTime()
                    this.$store.commit('updateNote', this.selectedNote)
                }
                else { // CREATE
                    this.selectedNote.id = this.idGenerator(this.notes)
                    this.selectedNote.userId = this.$store.state.user.id
                    this.selectedNote.updatedAt = new Date().getTime()
                    this.$store.commit('createNote', this.selectedNote)                    
                }
                this.selectedNote = {...noteInitialState}
                this.getNotes()
            },

            

            idGenerator(arrayObject){
                let biggest = 1
                arrayObject.forEach(el => {
                    if(el.id >= biggest)
                        biggest = el.id+1                    
                })
                return biggest
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .dashContainer
        display: flex 
        height: 100%

    .dashAside
        display: flex
        flex-direction: column
        justify-content: center
        width: 227px
        background-color: #F4FBFF        
        padding-left: 40px  
        padding-bottom: 50px
        box-shadow: 0px 1px 10px 0px rgba(40, 56, 72, 0.06)
        overflow-y: auto
        .category
            display: block
            color: #4E5F70
            font-weight: 700
            font-size: 17px
            line-height: 18px
            margin-bottom: 40px
        .catList
            list-style: none
            margin: 0px
            padding: 0px
            .catItem
                display: flex
                align-items: center
                margin: 12px 0px                
                cursor: pointer
                color: #283848
                font-weight: 700
                &:hover, &.selected
                    color: #2693FF
                > i
                    font-size: 10px
                .catName
                    margin-left: 12px                    
                    font-size: 15px
                    line-height: 25px
                .catChip
                    display: flex
                    align-items: center
                    justify-content: center
                    margin-left: 5px
                    width: 20px
                    height: 20px
                    border-radius: 50%                    
                    font-size: 11px
                    line-height: 12px
                    color: #fff
                    &.red
                        background-color: #FF2E79
                    &.yellow
                        background-color: #FFC42E
        .catInput
            display: none

    .dashMain
        flex: 1
        display: flex
        padding-top: 10vh
        background-color: #E9F4FB
        justify-content: center
        overflow-y: auto
        h3
            font-weight: 700
            font-size: 26px
            line-height: 27px
            color: #283848

    .dashContent
        width: 635px
        max-width: 635px
        > p
            font-weight: 600
            font-size: 17px
            line-height: 18px
            color: #77899E
            .username, .taskAmount
                color: #2693FF
            .taskAmount
                text-decoration: underline
        .search
            margin: 31px 0px
        .userNote
            margin: 7px 0px

    .btnNew
        position: absolute
        right: 28px
        bottom: 23px
        width: 77px
        height: 77px
        font-size: 24px

    .delNoteModal        
        padding: 40px 10px 
        .bigIcon
            display: flex
            align-items: center
            justify-content: center
            height: 136px
            width: 136px
            border-radius: 50%
            background-color: #EDF6FC
            margin: auto
            i
                font-size: 67px
                display: block
                color: #4A6583
        > p
            text-align: center
            margin-top: 12px
            margin-bottom: 4px
            font-weight: 700
            font-size: 20px
            line-height: 21px
            color: #283848
            span
                color: #FF4874
        > span
            display: block
            text-align: center
            font-weight: 600
            font-size: 15px
            line-height: 16px
            color: #475E78
            margin-bottom: 29px
        > div
            text-align: center
            margin-bottom: 6px
            .btn
                height: 41px
                margin: 0px 6px
                padding: 0px 27px            

    .editNoteModal
        position: relative
        padding: 1px 40px 40px 40px
        .modalCloseBtn
            cursor: pointer
            position: absolute
            right: 17px
            top: 19px
            // font-size: 10px
        h3
            margin-bottom: 59px
        .note
            margin-bottom: 15px
        .description
            margin-bottom: 17px
            height: 183px
        .footer
            display: flex
            justify-content: space-between
            align-items: center
            div
                display: flex
                .divRadio
                    position: relative
                    display: flex
                    align-items: center
                    margin-right: 12px
                    cursor: pointer
                    .outer
                        position: absolute
                        border-radius: 50%
                        border: 2px solid #BFDAEB
                        background-color: inherit
                        width: 24px
                        height: 24px
                    .inner
                        display: none
                        position: absolute
                        z-index: 1
                        left: 6.5px
                        border-radius: 50%
                        background-color: #2693FF     
                        width: 10px
                        height: 10px  
                    &.selected .inner
                        display: block
                    .label
                        margin-left: 33px
                        font-weight: 600;
                        font-size: 14px;
                        line-height: 15px;
                        color: #4E657B
            button
                padding-left: 23px
                padding-right: 23px

    // DROPDOWN BTN
    .catListMobile
        display: none
        width: 100%
        height: 100%
        .header
            display: flex
            width: 100%
            padding: 0px 40px
            justify-content: space-between
            align-items: center
            font-weight: 600
            cursor: pointer
        &.open .dropdown-content 
            display: block            
        .dropdown-content 
            display: none
            position: absolute
            z-index: 1
            border-radius: 0px
            box-shadow: 0px 0px 8px 2px rgba(49, 81, 113, 0.1)
            background-color: #fff
            width: 100%
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2)
            padding-top: 11px 
            top: 60px
            ul 
                list-style: none
                padding: 0px
                .catItem
                    display: block
                    cursor: pointer
                    padding: 8px 0px 8px 40px
                    font-weight: 600
                    &:hover
                        background-color: #2693FF
                        color: #fff   
                    i
                        font-size: 12px
                        margin-right: 8px
                    
            
                

    @media only screen and (max-width: 1180px)
        .btnNew{
            position: unset
        }
        .divBtnNew{
            margin: 20px 0px
            text-align: end
        }        

    @media only screen and (max-width: 1023px)
        .dashContainer
            flex-direction: column
        .dashContent
            width: 90%
            min-width: 360px
            max-width: 90%            
       
        .dashAside            
            height: 60px
            width: 100%
            padding: 0px
            margin: 0px
            > div
                flex: 1
            .category
                display: none                
            .catList
                display: none
            .catListMobile
                display: flex
                justify-content: space-between
        
</style>