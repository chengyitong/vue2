<template>
	<div id="fitstcomponent">
		<h1>I am a title</h1>
		<p>written by {{ author }}</p>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				author: 'ytcheng'
			}
		}
	}
</script>