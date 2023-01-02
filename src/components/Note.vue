<template>
    <div v-if="Object.keys(note).length" class="note" :class="note.done ? 'done' : ''">

        <label class="checkContainer" >
            <span class="checkLabel">{{note.title}}</span>
            <input type="checkbox" :checked="note.done ? true : false" @change="updateValue()">
            <span class="checkmark"></span>
        </label>

        <div>
            <!-- chip -->
            <span v-if="note.category" class="chip" :class="note.category === 'Urgente' ? 'red' : 'yellow'">
                {{note.category}}
            </span>
            <!-- icon -->
            <div class="dropdown">
                <i class="fas fa-ellipsis-v showOptions"></i>
                <div class="dropdown-content">
                    <i class="fas fa-ellipsis-v topIcon"></i>
                    <ul>
                        <li @click="editEvent()">
                            <i class="fas fa-circle green"></i><span>Editar</span>
                        </li>
                        <li @click="delEvent()">
                            <i class="fas fa-circle red"></i><span>Excluir</span>
                        </li>
                    </ul>
                </div>
            </div>
            
        </div>

    </div>
</template>

<script>
    export default {
        props: {
            note: Object
        },

        data(){
            return {
                noteLocal: {},
                id: null
            }
        },

        beforeMount(){
            this.id = this._uid
        },

        mounted(){            
            // this.noteLocal = {...this.note}
        },

        methods: {
            editEvent(){
                this.$emit('edit', this.note)
            },
            delEvent(){
                this.$emit('delete', this.note)
            },

            updateValue(){
                this.$emit('check', this.note)
            }
        }

    }
</script>

<style lang="stylus" scoped>
    .note 
        display: flex
        align-items: center
        justify-content: space-between
        background-color: #fff
        padding: 16px 16px 16px 14px
        border-radius: 5px
        &.done
            opacity: 50%
            .checkContainer
                text-decoration: line-through     
        > div
            display: flex
            flex-wrap: none
        .chip
            display: flex
            align-items: center
            height: 20px
            font-weight: 700
            font-size: 11px
            line-height: 12px
            padding: 3px 10px
            border-radius: 40px
            color: #fff
            margin: 0px 23px
            &.red
                background-color: #FF2E79
            &.yellow
                background-color: #FFC42E
        
        .showOptions
            color: #9CAEC1
            cursor: pointer
            font-size: 15px


    //  CUSTOM CHECKBOX
    /* Customize the label (the checkContainer) */
    .checkContainer 
        position: relative        
        display: block
        cursor: pointer        
        -webkit-user-select: none
        -moz-user-select: none
        -ms-user-select: none
        user-select: none        
        .checkLabel
            display: flex
            align-items: center
            height: 33px
            padding-left: 46px
            font-weight: 600
            font-size: 15px
            line-height: 16px            
        /* Hide the browser's default checkbox */
        input 
            position: absolute
            opacity: 0
            cursor: pointer
            height: 0
            width: 0
        /* Create a custom checkbox */
        .checkmark 
            border-radius: 5px
            position: absolute
            top: 0
            left: 0
            width: 33px
            height: 32px
            background-color: #E2EEF5
    /* On mouse-over, add a grey background color */
    .checkContainer:hover input ~ .checkmark 
        background-color: #d6e1e8
    /* When the checkbox is checked, add a green background */
    .checkContainer input:checked ~ .checkmark 
        background-color: #0ED984
    /* Create the checkmark/indicator (hidden when not checked) */
    .checkmark:after 
        content: ""
        position: absolute
        display: none
    /* Show the checkmark when checked */
    .checkContainer input:checked ~ .checkmark:after 
        display: block
    /* Style the checkmark/indicator */
    .checkContainer .checkmark:after 
        left: 13px
        top: 5px
        width: 6px
        height: 14px
        border: solid white
        border-width: 0 2px 2px 0
        -webkit-transform: rotate(45deg)
        -ms-transform: rotate(45deg)
        transform: rotate(45deg)

    // Dropdown
    .dropdown 
        position: relative
        display: inline-block
        &:hover .dropdown-content 
            display: block            
    .dropdown-content 
        display: none
        position: absolute
        z-index: 1
        border-radius: 5px
        box-shadow: 0px 0px 8px 2px rgba(49, 81, 113, 0.1)
        background-color: #fff
        width: 109px
        height: 74px
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2)
        padding-top: 11px 
        padding-left: 16px
        margin-top: -27px
        margin-left: -93px
        ul
            margin: 0px
            padding: 0px
            cursor: pointer
            li    
                display: flex
                align-items: center        
                list-style: none
                i 
                    font-size: 9px
                    color: #D6E6EF
                &:hover .green
                    color: #5ECDA5
                &:hover .red
                    color: #FF4874
                span                    
                    color: #5D7893
                    font-weight: 600
                    font-size: 14px
                    line-height: 25px
                    margin-left: 5px
                
        .topIcon
            position: absolute
            top: 11px
            right: 11px
            color: #2693FF
            font-size: 15px

    @media only screen and (max-width: 768px)
        
        .note
            > div
                min-width: 120px
        .checkContainer
            .checkLabel
                font-size: 12px
                line-height: 13px
        

</style>