<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container" :style="width ? `max-width: ${width}` : 'max-width: 350px'">
                    <div>
                        <slot name="body">
                            <!-- default body -->
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        props: {
            width: String // css width value
        }
        
    }
</script>

<style lang="stylus" scoped>
    .modal-mask
        position: fixed
        z-index: 9998
        top: 0
        left: 0
        width: 100%
        height: 100%
        background-color: rgba(0, 0, 0, 0.5)
        display: table
        transition: opacity 0.3s ease
    
    .modal-wrapper
        display: table-cell
        vertical-align: middle
        
    
    .modal-container
        background-color: #fff
        margin: 0px auto
        box-shadow: 0px 20px 30px rgba(119, 137, 158, 0.5)
        border-radius: 8px
        transition: all 0.3s ease
        
    /*
    * The following styles are auto-applied to elements with
    * transition="modal" when their visibility is toggled
    * by Vue.js.   
    */
    .modal-enter
        opacity: 0
    
    .modal-leave-active
        opacity: 0
    
    .modal-enter .modal-container,
    .modal-leave-active .modal-container
        -webkit-transform: scale(1.1)
        transform: scale(1.1)
</style>