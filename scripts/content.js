/**************************

		LISTENERS

***************************/

//Listener required to receive messages from background.js
chrome.runtime.onMessage.addListener( function( request, sender, sendResponse )
	{
		//the background will pass along the library of images via this request
		if ( request.action == "showLibrary" )
		{
			showLibrary( request.library );

			//donate will be true after every 20 'insert' actions.
			if ( request.donate === true )
			{
				//display the donate button
				$( "#gifsterDonateButton" ).css( "display", "inline-block" );
			}
		}
		//the background will add new bookmarks to the library via this request
		else if ( request.action == "addBookmark" )
		{
			//Only add a new bookmark if the library has already been initialized.
			if ( $( "#gifsterContainer" ).exists() )
			{
				addBookmark( request.newImage );
			}
		}
		else if ( request.action == "removeBookmark" )
		{
			//Only add a new bookmark if the library has already been initialized.
			if ( $( "#gifsterContainer" ).exists() )
			{
				removeBookmark( request.url );
			}
		}
	});


/**************************

	  JQUERY FUNCTIONS

***************************/

//jQuery function to test if a selector returns nothing
$.fn.exists = function () {
    return this.length !== 0;
}


/**************************

	  GLOBAL VARIABLES

***************************/

//activeField is a global variable for keeping track of which textfield to insert the url into.
//This is required because the "active" element changes when you select an image to insert
//by clicking on it. Maybe there is a nicer way to do this ...
var activeField;


/**************************

		UI VISIBILITY

***************************/

/*
* showLibrary makes a UI window show up with a list of the user's images.
*/
function showLibrary( library )
{
	//Set the global variable 'activeField' to the input field that is currently selected in the source page.
	activeField = document.activeElement;

	//Check if the UI window has been inserted into the source HTML already
	if ( !$( "#gifsterContainer" ).exists() )
	{
		//The UI has not been inserted into the source HTML. Insert it now.
		createLibrary( library );
		//Insert the user's gif library to the UI window.
		populateLibrary( library );
	}
	//The UI has been created already. Check if it is currently being displayed.
	else if( $( "#gifsterContainer" ).css( "display" ) != "block" )
	{
		//Display the UI div
		$( "#gifsterContainer" ).css( "display", "block" );
	}

	//scroll triggers lazy loading so that new images in the library are loaded.
	$( "#gifsterList" ).scroll();
}

/*
* hideLibrary hides the gifster UI window
*/
function hideLibrary()
{
	//Check if the UI is currently being displayed.
	if( $( "#gifsterContainer" ).css( "display" ) != "none" )
	{
		//Ensure that the remove image 'confirmation window' is closed.
		hideConfirmation();
		//Set the scroll position to the top to prepare for the next time the UI is displayed.
		$( "#gifsterList" ).scrollTop( 0 );
		//Hide the UI		
		$( "#gifsterContainer" ).css( "display", "none" );
		//Hide the donation button to prepare for the next time the UI is displayed.
		$( "#gifsterDonateButton" ).css( "display", "none" );
	}
}

/*
* showConfirmation shows the remove image confirmation window.
*/
function showConfirmation()
{
	//If the confimation window is currently hidden.
	if( $( "#gifsterConfirm" ).css( "display" ) != "block" )
	{
		//Display the confirmation window
		$( "#gifsterConfirm" ).css( "display", "block" );
	}
}

/*
* hideConfirmation hides the remove image confirmation window.
*/
function hideConfirmation()
{
	//If the confirmation window is currently being displayed.
	if( $( "#gifsterConfirm" ).css( "display" ) != "none" )
	{
		//Hide the confirmation window
		$( "#gifsterConfirm" ).css( "display", "none" );
	}
}

/*
* showLinkCopy shows the link copy window.
*/
function showLinkCopy()
{
	//If the confimation window is currently hidden.
	if( $( "#gifsterCopy" ).css( "display" ) != "block" )
	{
		//Display the confirmation window
		$( "#gifsterCopy" ).css( "display", "block" );
	}
}

/*
* hideLinkCopy hides the link copy window.
*/
function hideLinkCopy()
{
	//If the confirmation window is currently being displayed.
	if( $( "#gifsterCopy" ).css( "display" ) != "none" )
	{
		//Hide the confirmation window
		$( "#gifsterCopy" ).css( "display", "none" );
	}
}


/**************************

	  UI CREATION

***************************/

/*
* createLibrary inserts the UI into the source HTML.
*/
function createLibrary()
{
	//Create the UI dom elements
	var container = document.createElement( "gifsterContainer" );
	var div = document.createElement( "gifsterDiv" );
	var anchor = document.createElement( "a" );
	var logo = document.createElement( "img" );
	var list = document.createElement( "gifsterList" );
	var listSpacer = document.createElement( "gifsterDiv" );
	var closeButton = document.createElement( "img" );
	//Create the donation elements
	var donateForm = document.createElement( "form" );
	var commandInput = document.createElement( "input" );
	var idInput = document.createElement( "input" );
	var submitInput = document.createElement( "input" );
	//Create the confirmation window elements
	var confirmWindow = document.createElement( "gifsterDiv" );
	var confirmPrompt = document.createElement( "gifsterText" );
	var confirmTrueText = document.createElement( "gifsterText" );
	var confirmFalseText = document.createElement( "gifsterText" );
	//Create the link copy window elements
	var copyWindow = document.createElement( "gifsterDiv" );
	var copyPrompt = document.createElement( "gifsterText" );
	var copyLink = document.createElement( "gifsterLink" );
	var copyFalseText = document.createElement( "gifsterText" );
	var copyTrueText = document.createElement( "gifsterText" );

	//Append all elements
	document.body.appendChild( container );
	container.appendChild( div );
	div.appendChild( list );
	div.appendChild( anchor );
	div.appendChild( donateForm );
	div.appendChild( closeButton );
	div.appendChild( confirmWindow );
	div.appendChild( copyWindow );
	anchor.appendChild( logo );
	list.appendChild( listSpacer );
	donateForm.appendChild( commandInput );
	donateForm.appendChild( idInput );
	donateForm.appendChild( submitInput );
	confirmWindow.appendChild( confirmPrompt );
	confirmWindow.appendChild( confirmTrueText );
	confirmWindow.appendChild( confirmFalseText );
	copyWindow.appendChild( copyPrompt );
	copyWindow.appendChild( copyLink );
	copyWindow.appendChild( copyFalseText );
	copyWindow.appendChild( copyTrueText );

	//Set attributes for the donation form
	donateForm.action = "https://www.paypal.com/cgi-bin/webscr";
	donateForm.method = "post";
	donateForm.target = "_blank";
	donateForm.id = "gifsterDonateForm";

	//Set attributes for the donation inputs
	commandInput.type = "hidden";
	commandInput.name = "cmd";
	commandInput.value = "_s-xclick";
	idInput.type = "hidden";
	idInput.name = "hosted_button_id";
	idInput.value = "LAVD93TYYBBR2";
	submitInput.id = "gifsterDonateButton";
	submitInput.type = "image";
	submitInput.src = chrome.extension.getURL("images/donate.png");
	submitInput.name = "image";
	submitInput.alt = "Donate button";

	//Set attributes for main containers
	container.id = "gifsterContainer";
	div.id = "gifsterWindow";

	//Set attributes for logo
	anchor.id = "gifsterLogoAnchor";
	anchor.href = "http://derekjonescanada.github.io/gifster";
	anchor.target = "_blank";
	logo.id = "gifsterLogo";
	logo.src = chrome.extension.getURL("images/logo_200.png");

	//Set attributes for list container
	list.id = "gifsterList";
	listSpacer.id = "gifsterListSpacer";

	//Set attributes for close button
	closeButton.id = "gifsterCloseButton";
	closeButton.src = chrome.extension.getURL("images/close_button.png");
	closeButton.onclick = function()
	{ 
		//Clicking the close button will hide the UI
		hideLibrary(); 
	};

	//Set attributes for confirmation container
	confirmWindow.id = "gifsterConfirm";
	confirmWindow.className = "gifsterPrompt";

	//Set attributes for confirmation text and buttons
	confirmPrompt.className = "gifsterText gifsterPromptText";
	confirmPrompt.innerHTML = "Remove this image from your library?";
	confirmTrueText.className = "gifsterText gifsterPromptButton gifsterConfirmTrue";
	confirmTrueText.innerHTML = "Ok";
	confirmTrueText.onclick = function()
	{ 
		//confirm that the user did indeed want to remove the image
		//the attribute "imageUrl" is set in the onclick handler of the trash button (see addBookmark function)
		confirmRemoveBookmark( true, this.getAttribute( "imageUrl" ) ); 
	};
	confirmFalseText.className = "gifsterText gifsterPromptButton gifsterConfirmFalse";
	confirmFalseText.innerHTML = "Cancel";
	confirmFalseText.onclick = function()
	{ 
		//confirm that the user did indeed want to remove the image
		confirmRemoveBookmark( false ); 
	};

	//Set attributes for link copying window
	copyWindow.id = "gifsterCopy";
	copyWindow.className = "gifsterPrompt";
	copyPrompt.id = "gifsterCopyPrompt";
	copyPrompt.className = "gifsterText gifsterPromptText";
	copyPrompt.innerHTML = "Copy link here:"
	copyLink.id = "gifsterCopyLink";
	copyLink.className = "gifsterText gifsterPromptLink gifsterPromptText";
	//tabindex allows the link to be focused so the user can copy it.
	copyLink.setAttribute( "tabindex", "-1" );
	$( copyLink ).on( "copy", function()
	{
		//use an animation when the user copies the link
		$( "#gifsterCopyLink" ).animate(
		{
		   opacity: 0,
		   top: '-=20',
		}, 200);

		$( "#gifsterCopyPrompt" ).html( "Copied! Press enter, or click done to finish." );
	});
	$( copyLink ).keyup( function( e )
	{
		//If the user pressed the enter key
	    if( e.which == 13 )
	    {
	    	//The user it done copying: Hide the UI and focus the activeElement
	        hideLinkCopy();
	        hideLibrary();
	        focusActiveField();
	    }
	});
	copyFalseText.className = "gifsterText gifsterPromptButton gifsterCopyFalse";
	copyFalseText.innerHTML = "Cancel";
	copyFalseText.onclick = function()
	{ 
		//The user cancelled copying this image link
		hideLinkCopy();
	};
	copyTrueText.className = "gifsterText gifsterPromptButton gifsterCopyTrue";
	copyTrueText.innerHTML = "Done";
	copyTrueText.onclick = function()
	{ 
		//The user it done copying: Hide the UI and focus the activeElement
		hideLinkCopy();
        hideLibrary();
        focusActiveField();
	};
}


/**************************

		IMAGE LIBRARY

***************************/

/*
* populateLibrary adds the image library into the UI
*/
function populateLibrary( library )
{	
	//'library' contains all of the links to the user's images.
	for (var i = 0; i < library.length; i++)
	{
		//add an image to the UI
		addBookmark( library[ i ] );
	}
}

/*
* addBookmark adds an image into the UI
*/
function addBookmark( newImage )
{
	var list = document.getElementById( "gifsterList" );
	var listItem = 	document.createElement( "gifsterListItem" );
	var image = document.createElement( "img" );
	var actionMenu = document.createElement( "gifsterDiv" );
	var insertButton = document.createElement( "img" );
	var trashButton = document.createElement( "img" );

	//insert the thumbnail to the front of the list.
	list.insertBefore( listItem, list.firstChild );

	listItem.className = "gifsterListItem";
	listItem.appendChild( image );
	listItem.appendChild( actionMenu );
	//the "first" child is the image, the "last" is the action menu. We want the action menu to appear on hover.
	$( listItem ).hover(
	    		function()
	    		{
	    			$(this).children(":last").css( "display", "block" );
	    		},
	    		function()
	    		{
	    			$(this).children(":last").css( "display", "none" );
	    		});

	image.className = "lazy";
	image.setAttribute( "data-src", newImage );
	image.src = chrome.extension.getURL( "images/loading.gif" );
	image.setAttribute( "alt", "Gifster image" );
	image.width = 220;
	image.height = 220;
	//This attr will be used in the event of an error so that the
	//image can be removed from the library
	image.setAttribute( "gifsterImageURL", newImage );

	actionMenu.className = "gifsterActionDiv";
	actionMenu.appendChild( insertButton );
	actionMenu.appendChild( trashButton );
	//This attr will be used in the onclick function so that gifsterImageURL 
	//can be inserted into the active field in the source page
	actionMenu.setAttribute( "gifsterImageURL", newImage );

	//A button to insert the url into the active field
	insertButton.className = "gifsterActionButton";
	insertButton.src = chrome.extension.getURL( "images/insert.png" );

	//A button to remove the image from the library
	trashButton.className = "gifsterActionButton";
	trashButton.src = chrome.extension.getURL( "images/trash.png" );

	//initiate lazy loading
	$( image ).lazy({
		bind: "event",
		enableThrottle: true,
	    throttle: 250,
	    effect: "fadeIn",
	    effectTime: 1000,
	    afterLoad: function( element )
	    {
	    	//Some of these are un-needed, but doing it in a one-liner makes things confusing.
	    	var image = $(element)[0];
	    	var listItem = image.parentNode;
	    	var actionDiv = listItem.lastChild;
	    	var insertButton = actionDiv.firstChild;
	    	var trashButton = actionDiv.lastChild;

	        $(insertButton).on( "click", function()
    		{
    			showLinkCopy();
    			//display the copy link window so that the user can copy the image url to their clipboard
				copyLink( this.parentNode.getAttribute( "gifsterImageURL" ) );
    		});

    		$(trashButton).on( "click", function()
    		{
    			//Confirm that the user wants to remove the image from their library.
    			showConfirmation();
    			$("#gifsterConfirm :nth-child(2)").attr("imageUrl", this.parentNode.getAttribute( "gifsterImageURL" ) );
    		});
	    },
	    onError: function( element )
	    {
	    	//If there is an error loading the image we assume the link is broken.
	    	//Remove the bookmark from the UI and background.
	    	removeBookmark( element.attr( "gifsterImageURL" ) );
	    }
	});
}

/*
* removeBookmarkBackend removes images with broken links from the background,
* The background then sends a message to all tabs so that the bookmark is removed from the UI
*/
function removeBookmarkBackend( url )
{
	//Remove the bookmarks from extension storage (ie. background)
	chrome.runtime.sendMessage( { action: "removeBookmark", url: url }, function(response) {} );
}

/*
* removeBookmark removes images from the UI
*/
function removeBookmark( url )
{
	//Remove the bookmark from the library UI
	var list = document.getElementById( "gifsterList" );
	var image = $( "img[ gifsterImageURL = '" + url + "' ]" )[ 0 ];
	var listItem = image.parentNode;

	list.removeChild( listItem );
}

/*
* The confirmation buttons call this function.
* The param 'confirm' confirms if the user wanted to remove the image
*/
function confirmRemoveBookmark( confirm, url )
{
	if( confirm == true )
	{
		//remove the image
    	removeBookmarkBackend( url );
	}
	
	//hide the confirm window
	hideConfirmation();
}

/*
* copyLink sets up an element to hold the link that the user will copy.
*/
function copyLink( url )
{
	//The element to hold the image url
	var link = document.getElementById( "gifsterCopyLink" );
	link.innerHTML = url;

	//Check if an animation has been performed already on the element
	if( $( link ).css( "opacity" ) == 0 )
	{
		//if so, we'll need to reverse it
		$( link ).animate(
		{
			opacity: 100,
		   	top: '+=20',
		}, 0);
		$( "#gifsterCopyPrompt" ).html( "Copy link here:" );
	}

	//Select the link so the user only need to use ctrl/cmd + C to copy
	if ( document.selection )
	{
        var range = document.body.createTextRange();
        range.moveToElementText( link );
        range.select();
    }
    else if ( window.getSelection() )
    {
        var range = document.createRange();
        range.selectNode( link );
        window.getSelection().removeAllRanges();
        window.getSelection().addRange( range );
    }

    //focus on the link so that key events are detected
    link.focus();
}

function focusActiveField()
{
	//activeField is a global variable that is set in the showLibrary function
	activeField.focus();
}