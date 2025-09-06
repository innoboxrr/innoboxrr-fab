<template>

	<div
		class="fab-wrapper"
		ref="fabWrapper"
		@mousedown="startDrag"
		@mouseup="endDrag"
		@mousemove="drag"
		:style="{ bottom: positionY + 'px', left: positionX + 'px' }">

		<input 
			ref="fabInput" 
			type="checkbox" 
			name="fab-toggle" 
			class="fab-toggle" />

		<a class="fab-button" href="#!" :style="{ backgroundColor: buttonColor }">

			<i class="fa fa-plus"></i>

		</a>

		<div class="fab-actions">
			
			<a
				v-for="(action, index) in actions"
				:key="index"
				:href="'#!'"
				:title="action.title"
				:style="{ backgroundColor: action.backgroundColor, transitionDelay: (index * 0.05) + 's' }"
				@click="actionClick(action)">
			
				<i :class="action.icon"></i>
			
			</a>

		</div>

	</div>

</template>

<script>

export default {

    props: {

        buttonColor: {
            type: String,
            default: 'red',
        },

        actions: {
            type: Array,
            default: () => [],
        },

        startPositionY: {
        	type: Number,
        	default: 50,
        },

        startPositionX: {
        	type: Number,
        	default: 50,
        },

    },

    emits: ['actionClick'],

    data() {

        return {

            isDragging: false,

            offsetX: 0,

            offsetY: 0,

            positionY: this.startPositionY,

            positionX: this.startPositionX,

        }

    },

    methods: {

        startDrag(event) {

            this.isDragging = true;

            const rect = this.$refs.fabWrapper.getBoundingClientRect();

            this.offsetX = event.clientX - rect.left;

            this.offsetY = event.clientY - rect.top - 55;

            window.addEventListener('mousemove', this.drag);

            window.addEventListener('mouseup', this.endDrag);

        },

        endDrag() {

            this.isDragging = false;

            window.removeEventListener('mousemove', this.drag);

            window.removeEventListener('mouseup', this.endDrag);

        },

        drag(event) {

            if(this.isDragging){

                this.positionX = event.clientX - this.offsetX;

                this.positionY = window.innerHeight - event.clientY + this.offsetY;

            }

        },

        actionClick(action) {

        	this.$emit('actionClick', action);

        }

    },

};

</script>

<style scoped>

	.fab-wrapper {
		position: fixed;
		z-index: 9999;
		opacity: 1;
		transition: opacity 0.3s ease-in-out;
	}

	.fab-toggle {
		-webkit-appearance: none;
		position: absolute;
		border-radius: 50%;
		top: 0;
		left: 0;
		margin: 0;
		width: 100%;
		height: 100%;
		cursor: pointer;
		background-color: transparent;
		border: none;
		outline: none;
		z-index: 2;
		transition: box-shadow 0.2s ease-in-out;
		box-shadow: 0 3px 5px 1px rgba(51, 51, 51, 0.3);
	}

	.fab-toggle:hover {
		box-shadow: 0 3px 6px 2px rgba(51, 51, 51, 0.3);
	}

	.fab-toggle:checked ~ .fab-actions a {
		opacity: 1;
		visibility: visible;
	}

	.fab-toggle:checked ~ .fab-button i {
		transform: rotate(180deg);
	}

	.fab-button {
		height: 56px;
		width: 56px;
		background-color: red;
		border-radius: 50%;
		color: #fff;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
	}

	.fab-button i {
		font-size: 16px;
		transform: rotate(0deg);
		transition: all 0.4s;
	}

	.fab-actions {
		position: absolute;
		width: 100%;
		bottom: 120%;
		text-align: center;
	}

	.fab-actions a {
		display: block;
		width: 45px;
		height: 45px;
		border-radius: 50%;
		text-decoration: none;
		margin: 10px auto 0;
		line-height: 1.15;
		color: #fff;
		opacity: 0;
		visibility: hidden;
		position: relative;
		box-shadow: 0 0 5px 1px rgba(51, 51, 51, 0.3);
	}

	.fab-actions a i {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.fab-actions a:hover {
		transform: scale(1.05);
	}

</style>
