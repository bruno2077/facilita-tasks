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
                        <span v-if="item.chip" class="catChip" :class="item.chip">
                            <span v-if="item.chip === 'red'">{{urgentAmount}}</span>
                            <span v-else>{{importantAmount}}</span>
                        </span>
                    </li>
                </ul>
            </div>
            <div class="catInput">
                <select>
                    options
                </select>
                <!-- dropdown menu aqui -->
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
                    
                <b-input class="search" icon="fas fa-search" v-model="searchInput" />
                <Note v-for="(note, index) in currentNotes" :key="index" :note="note" class="userNote" 
                    @edit="getNoteToEdit" @delete="getNoteToDelete"
                />
            </div>
            
            <button class="btn green round btnNew">
                <i class="fas fa-plus"></i>
            </button>
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
                        <button class="btn green" :disabled="!selectedNote.title">Adicionar</button>
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
                        <button class="btn red">Confirmar</button>
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
    const cNotes = JSON.parse(JSON.stringify([
            {
                "id":1,
                "userId":1,
                "done":false,
                "category":"Urgente",
                "title":"Digitar o código a cada 108 minutos... para sempre.",
                "description":"O não descumprimento pode levar a um evento de fim do mundo. Não se sabe quando isso começou ou quem começou.",
                "updatedAt":1672357852248
            },
            {
                "id":2,
                "userId":1,
                "done":true,
                "category":"",
                "title":"Foo Bar Baz",
                "description":"Lorem Ipsum",
                "updatedAt":1672357752248
            },
            {
                "id":3,
                "userId":1,
                "done":true,
                "category":"Importante",
                "title":"WAKE UP",
                "description":"Eu estou sonhando ou acordado? este é o sonho ou a realidade?",
                "updatedAt":1672357772248
            }
        ]))
    export default {
        name: 'DashBoard',
        components: {
            'b-input': BrInput,
            Note,
            'b-modal': Modal
        },

        data(){
            return {
                categories: [
                    {
                        name: 'Todas',
                    },
                    {
                        name: 'Urgentes',
                        chip: 'red'
                    },
                    {
                        name: 'Importantes',
                        chip: 'yellow',
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
                selectedNote: noteInitialState
            }
        },

        beforeMount(){
            console.log("[D] ao montar o dash temos: ", JSON.parse(JSON.stringify(this.$store.getters.userNotes)))
            console.log("[D] ao montar o dash notes: ", this.$store.getters.userNotes)
            this.notes = cNotes
            this.currentNotes = cNotes
            // this.notes = Array.from(this.$store.getters.userNotes)
            // this.currentNotes = Array.from(this.$store.getters.userNotes)
        },
        
        computed: {
            urgentAmount(){
                console.log("[D] Notas:", this.notes.length)
                console.log("[D] Notas Urgentes: ", this.notes.filter(el => el.category === 'Urgente').length)
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

        // mete um @change lá depois
        // watch:{
        //     searchInput(newValue){
        //         // faz um filtro numa currentVar
        //     }
        // },

        methods: {
            selectCategory(name){
                this.selectedCategory = name
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

            delNote(){
                this.$state.commit('deleteNote', this.selectedNote)
                this.notes = [...this.$store.state.users[0].notes]
                // roda o filtro
                this.showDelModal = true
            },
            editNote(){                
                this.$state.commit('updateNote', this.selectedNote)
                this.notes = [...this.$store.state.users[0].notes]
                // roda o filtro
                
            },
            closeEditModal(){
                this.selectedNote = noteInitialState
                this.showEditModal = false
            },
            
            setSelectedNoteCategory(name){
                if(name === this.selectedNote.category)
                    this.selectedNote.category = ''
                else this.selectedNote.category = name
            },
            closeDelModal(){
                this.selectedNote = noteInitialState
                this.showDelModal = false
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

    @media only screen and (max-width: 577px)
        .dashContainer
            flex-direction: column
        .dashAside            
            height: 60px
            width: 100%
            padding-bottom: 0px
            .category
                margin-bottom: 5px
            .catList
                display: none
            .catInput
                display: block
</style>