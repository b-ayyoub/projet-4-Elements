// Fonction pour ouvrir la lightbox et afficher l'image en grand
function openLightbox(img) {
    // Modifie le style de la lightbox pour la rendre visible (en mode "flex")
    document.getElementById("lightbox").style.display = "flex";
    
    // Modifie la source de l'image dans la lightbox pour qu'elle affiche l'image sélectionnée
    document.getElementById("lightbox-img").src = img.src;
}

// Fonction pour fermer la lightbox
function closeLightbox() {
    // Cache la lightbox en modifiant son style pour le mettre à "none" (invisible)
    document.getElementById("lightbox").style.display = "none";
}


/////////////////////////////////////////////////////////////////////////////////////////// code carousel ////////////////////////////////////////////////////////////////////////////////////////

// Sélectionner toutes les images dans les cartes de la section de défilement
const images = document.querySelectorAll('.scroll-section .card img');

// Ajouter un événement 'click' sur chaque image
images.forEach(function (img) {
    img.addEventListener('click', function () {
        // Trouve la section contenant les cartes
        const section = img.closest('.scroll-section');
        
        // Récupère la largeur d'une carte
        const cardWidth = section.querySelector('.card').offsetWidth;

        // Récupère la largeur totale de la section
        const sectionWidth = section.scrollWidth;

        // Récupère la largeur visible de la section
        const sectionVisibleWidth = section.offsetWidth;

        // Récupère la position actuelle du défilement
        const scrollPosition = section.scrollLeft;

        // Si on est à la fin de la section (ou presque), revenir au début
        if (scrollPosition + sectionVisibleWidth >= sectionWidth) {
            section.scrollTo({
                left: 0, // Revenir au début
                behavior: 'smooth' // Défilement fluide
            });
        } else {
            // Sinon, faire défiler vers la droite de la largeur d'une carte
            section.scrollBy({
                left: cardWidth, // On défile vers la droite
                behavior: 'smooth' // Défilement fluide
            });
        }
    });
});

/// j'ai un tracKpad tactile il me fait défiler le scroll lorsque je fait défiler mon doigt dessus de gauche à droite

////////////////////////////////////////////////////////////////////////////////// FORMULAIRE ///////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reservationForm');
    const modal = document.getElementById('confirmationModal');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelBtn');
    const payBtn = document.getElementById('payBtn');
    const confirmationDetails = document.getElementById('confirmationDetails');
    const invoiceDetails = document.getElementById('invoiceDetails');
    
  // Afficher/masquer les options des repas et petit-déjeuner
document.getElementById('breakfast').addEventListener('change', function() {
    // Lorsqu'il y a un changement dans l'élément "breakfast" (case à cocher pour le petit déjeuner),
    // on vérifie si l'utilisateur a coché la case.
    // Si elle est cochée, on affiche les options liées au petit déjeuner, sinon on les masque.
    document.getElementById('breakfastOptions').style.display = this.checked ? 'block' : 'none';
});

// L'événement 'change' est déclenché lorsque la valeur de l'élément change (c'est-à-dire lorsque l'utilisateur
// coche ou décoche la case de repas). Le comportement est similaire à celui du petit déjeuner ci-dessus.
document.getElementById('meal').addEventListener('change', function() {
    // Afficher ou masquer les options de repas en fonction de l'état de la case à cocher "meal".
    document.getElementById('mealOptions').style.display = this.checked ? 'block' : 'none';
});

// Validation des dates : gérer la sélection de la date d'arrivée
document.getElementById('arrivalDate').addEventListener('change', function() {
    // Lorsqu'une date d'arrivée est sélectionnée, on récupère cette valeur et on crée un objet Date pour cette date.
    const arrivalDate = new Date(this.value);
    
    // Récupérer l'élément "departureDate" (la date de départ)
    const departureDateInput = document.getElementById('departureDate');
    
    // Calculer la date de départ minimum : la date de départ doit être au moins un jour après la date d'arrivée
    const minDepartureDate = new Date(arrivalDate);
    minDepartureDate.setDate(minDepartureDate.getDate() + 1); // Ajouter un jour à la date d'arrivée pour obtenir la date minimale de départ.
    
    // Définir cette date minimale comme la date la plus proche possible pour le départ
    // La méthode toISOString() permet de convertir la date en format ISO (YYYY-MM-DD) compatible avec les inputs HTML.
    departureDateInput.min = minDepartureDate.toISOString().split('T')[0];
    
    // Si la date de départ actuelle est avant la nouvelle date minimum, on réinitialise la valeur de la date de départ.
    if (departureDateInput.value && new Date(departureDateInput.value) < minDepartureDate) {
        departureDateInput.value = ''; // Réinitialiser la valeur de la date de départ.
    }
});

    
// Soumission du formulaire
form.addEventListener('submit', function(e) {
    // Empêche l'action de soumission par défaut (rechargement de la page)
    e.preventDefault();
    
    // Vérifie si le formulaire est valide avant de montrer la confirmation
    if (validateForm()) {
        showConfirmation(); // Si le formulaire est valide, affiche la modal de confirmation
    }
});

// Gestion de la modal : fermeture de la modal lorsqu'on clique sur le bouton "close"
closeBtn.addEventListener('click', function() {
    // Cache la modal (en la rendant invisible)
    modal.style.display = 'none';
});

// Gestion du bouton "Annuler" dans la modal
cancelBtn.addEventListener('click', function() {
    // Cache la modal si l'utilisateur clique sur "Annuler"
    modal.style.display = 'none';
});

// Gestion du bouton "Payer" dans la modal
payBtn.addEventListener('click', function() {
    // Affiche un message d'alerte pour indiquer que le paiement a été effectué
    alert('Paiement effectué avec succès! Merci pour votre réservation.');
    
    // Cache la modal après la confirmation du paiement
    modal.style.display = 'none';
    
    // Réinitialise le formulaire pour le préparer pour une nouvelle réservation
    form.reset();
});

// Ferme la modal si l'utilisateur clique à l'extérieur de la modal (sur le fond)
window.addEventListener('click', function(event) {
    // Si l'utilisateur clique en dehors de la zone de la modal (sur l'arrière-plan)
    if (event.target === modal) {
        // Cache la modal
        modal.style.display = 'none';
    }
});

    // Fonction de validation
    function validateForm() {
        let isValid = true;
        
        // Validation des champs texte
        const textFields = [
            { id: 'lastName', min: 2, max: 50, errorId: 'lastNameError' },
            { id: 'firstName', min: 2, max: 50, errorId: 'firstNameError' },
            { id: 'streetName', min: 1, max: 150, errorId: 'streetNameError' },
            { id: 'city', min: 1, max: 100, errorId: 'cityError' }
        ];
        
     // Parcourt chaque champ de texte (textFields) pour valider sa longueur
textFields.forEach(field => {
    // Récupère l'élément du champ de texte et son élément d'erreur associé
    const element = document.getElementById(field.id);
    const errorElement = document.getElementById(field.errorId);
    
    // Vérifie si la longueur de la valeur du champ est en dehors des limites spécifiées (min et max)
    if (element.value.length < field.min || element.value.length > field.max) {
        // Si la validation échoue, affiche un message d'erreur et marque le champ comme invalide
        errorElement.textContent = `Doit contenir entre ${field.min} et ${field.max} caractères`;
        isValid = false;
    } else {
        // Si la validation est réussie, enlève tout message d'erreur
        errorElement.textContent = '';
    }
});

  // Validation numéro de rue
const streetNumber = document.getElementById('streetNumber'); // Sélectionne le champ du numéro de rue
const streetNumberError = document.getElementById('streetNumberError'); // Sélectionne l'élément pour afficher l'erreur

// Vérifie si le numéro de rue est valide (doit être un nombre positif)
if (!streetNumber.value || streetNumber.value <= 0) {
    streetNumberError.textContent = 'Veuillez entrer un numéro de rue valide'; // Affiche l'erreur si invalide
    isValid = false; // Marque la validation comme échouée
} else {
    streetNumberError.textContent = ''; // Enlève l'erreur si valide
}

// Validation code postal
const postalCode = document.getElementById('postalCode'); // Sélectionne le champ du code postal
const postalCodeError = document.getElementById('postalCodeError'); // Sélectionne l'élément pour afficher l'erreur

// Vérifie si le code postal est valide (doit être composé de 5 chiffres)
if (!postalCode.value.match(/^[0-9]{5}$/)) {
    postalCodeError.textContent = 'Le code postal doit contenir 5 chiffres'; // Affiche l'erreur si invalide
    isValid = false; // Marque la validation comme échouée
} else {
    postalCodeError.textContent = ''; // Enlève l'erreur si valide
}

// Validation email
const email = document.getElementById('email'); // Sélectionne le champ de l'email
const emailError = document.getElementById('emailError'); // Sélectionne l'élément pour afficher l'erreur

// Vérifie si l'email est valide (format d'email et longueur maximale de 100 caractères)
if (!email.value.match(/^[^@]+@[^@]+\.[^@]+$/) || email.value.length > 100) {
    emailError.textContent = 'Veuillez entrer une adresse email valide (max 100 caractères)'; // Affiche l'erreur si invalide
    isValid = false; // Marque la validation comme échouée
} else {
    emailError.textContent = ''; // Enlève l'erreur si valide
}

// Validation téléphone
const phone = document.getElementById('phone'); // Sélectionne le champ du numéro de téléphone
const phoneError = document.getElementById('phoneError'); // Sélectionne l'élément pour afficher l'erreur

// Vérifie si le numéro de téléphone est valide (doit être composé de 10 chiffres ou d'un format international)
if (!phone.value.match(/^[0-9]{10}$|^[0-9 \-/]{14}$/)) {
    phoneError.textContent = 'Veuillez entrer un numéro de téléphone valide (10 chiffres)'; // Affiche l'erreur si invalide
    isValid = false; // Marque la validation comme échouée
} else {
    phoneError.textContent = ''; // Enlève l'erreur si valide
}

 // Validation hôtel et nombre de personnes
const hotel = document.getElementById('hotel'); // Sélectionne le champ de l'hôtel
const hotelError = document.getElementById('hotelError'); // Sélectionne l'élément pour afficher l'erreur
const guests = document.getElementById('guests'); // Sélectionne le champ du nombre de personnes
const guestsError = document.getElementById('guestsError'); // Sélectionne l'élément pour afficher l'erreur

// Vérifie si un hôtel a été sélectionné
if (!hotel.value) {
    hotelError.textContent = 'Veuillez sélectionner un hôtel'; // Affiche l'erreur si aucun hôtel sélectionné
    isValid = false; // Marque la validation comme échouée
} else {
    hotelError.textContent = ''; // Enlève l'erreur si un hôtel est sélectionné
}

// Vérifie si le nombre de personnes a été renseigné
if (!guests.value) {
    guestsError.textContent = 'Veuillez sélectionner le nombre de personnes'; // Affiche l'erreur si aucune personne sélectionnée
    isValid = false; // Marque la validation comme échouée
} else {
    guestsError.textContent = ''; // Enlève l'erreur si le nombre de personnes est renseigné
}

// Validation des dates
const arrivalDate = document.getElementById('arrivalDate'); // Sélectionne le champ de la date d'arrivée
const arrivalDateError = document.getElementById('arrivalDateError'); // Sélectionne l'élément pour afficher l'erreur
const departureDate = document.getElementById('departureDate'); // Sélectionne le champ de la date de départ
const departureDateError = document.getElementById('departureDateError'); // Sélectionne l'élément pour afficher l'erreur

// Vérifie si la date d'arrivée est renseignée
if (!arrivalDate.value) {
    arrivalDateError.textContent = 'Veuillez sélectionner une date d\'arrivée'; // Affiche l'erreur si pas de date d'arrivée
    isValid = false; // Marque la validation comme échouée
} else {
    arrivalDateError.textContent = ''; // Enlève l'erreur si la date d'arrivée est renseignée
    
    // Vérifie que la date d'arrivée n'est pas dans le passé
    const today = new Date(); // Crée une nouvelle date pour aujourd'hui
    today.setHours(0, 0, 0, 0); // Met les heures, minutes, secondes et millisecondes à zéro pour éviter les erreurs
    
    if (new Date(arrivalDate.value) < today) {
        arrivalDateError.textContent = 'La date d\'arrivée ne peut pas être dans le passé'; // Affiche l'erreur si la date d'arrivée est dans le passé
        isValid = false; // Marque la validation comme échouée
    } else {
        arrivalDateError.textContent = ''; // Enlève l'erreur si la date est valide
    }
}

// Vérifie si la date de départ est renseignée
if (!departureDate.value) {
    departureDateError.textContent = 'Veuillez sélectionner une date de départ'; // Affiche l'erreur si pas de date de départ
    isValid = false; // Marque la validation comme échouée
} else {
    departureDateError.textContent = ''; // Enlève l'erreur si la date de départ est renseignée
    
    // Vérifie que la date de départ est après la date d'arrivée
    if (arrivalDate.value && new Date(departureDate.value) <= new Date(arrivalDate.value)) {
        departureDateError.textContent = 'La date de départ doit être après la date d\'arrivée'; // Affiche l'erreur si la date de départ est avant ou égale à la date d'arrivée
        isValid = false; // Marque la validation comme échouée
    } else {
        departureDateError.textContent = ''; // Enlève l'erreur si la date est valide
    }
}

// Retourne true si toutes les validations sont réussies, sinon false
return isValid;

}
    
 // Afficher la confirmation
function showConfirmation() {
    // Récupérer les valeurs du formulaire
    const formData = new FormData(form); // Crée un objet FormData à partir du formulaire pour récupérer les valeurs des champs
    const data = Object.fromEntries(formData.entries()); // Convertit les données du formulaire en un objet clé-valeur
    
    // Calculer le nombre de nuits
    const arrivalDate = new Date(data.arrivalDate); // Crée un objet Date à partir de la date d'arrivée
    const departureDate = new Date(data.departureDate); // Crée un objet Date à partir de la date de départ
    const nights = Math.ceil((departureDate - arrivalDate) / (1000 * 60 * 60 * 24)); // Calcule le nombre de nuits (différence entre la date de départ et la date d'arrivée)

    // Calculer le prix total
    let total = 0; // Initialise la variable total à 0
    let invoiceItems = []; // Initialise un tableau pour stocker les éléments de la facture

    // Prix de la chambre
    const roomPrice = data.hotel === 'igloo' ? 500 : 850; // Détermine le prix de la chambre en fonction de l'hôtel sélectionné (Igloo = 500€/nuit, Suite Laponne = 850€/nuit)
    const roomTotal = roomPrice * nights; // Calcule le total du prix de la chambre en fonction du nombre de nuits
    total += roomTotal; // Ajoute le prix total de la chambre au montant total
    invoiceItems.push({ // Ajoute un objet représentant l'élément de la chambre dans le tableau invoiceItems
        name: data.hotel === 'igloo' ? 'Igloo (500€/nuit)' : 'Suite Laponne (850€/nuit)', // Nom de l'élément dans la facture (en fonction de l'hôtel)
        quantity: nights, // Quantité (nombre de nuits)
        price: roomPrice, // Prix par nuit
        total: roomTotal // Total pour la chambre
    });

        
// Options supplémentaires

// Option Chauffeur
if (data.driver === '11') { 
    // Si l'utilisateur a sélectionné l'option chauffeur (11€/jour)
    const driverTotal = 11 * nights; // Calcul du coût total du chauffeur pour le nombre de nuits
    total += driverTotal; // Ajouter le coût du chauffeur au total général
    invoiceItems.push({ // Ajouter cet élément à la facture
        name: 'Chauffeur (11€/jour)', // Description de l'option
        quantity: nights, // Quantité (nombre de nuits)
        price: 11, // Prix par jour
        total: driverTotal // Total pour l'option chauffeur
    });
}

// Option Petit déjeuner
if (data.breakfast === '15') {
    // Si l'utilisateur a sélectionné l'option petit déjeuner (15€/personne/jour)
    const guests = parseInt(data.guests); // Nombre d'invités (en convertissant le nombre de personnes en entier)
    const breakfastTotal = 15 * guests * nights; // Calcul du coût total du petit déjeuner pour le nombre d'invités et le nombre de nuits
    total += breakfastTotal; // Ajouter le coût du petit déjeuner au total général
    invoiceItems.push({ // Ajouter cet élément à la facture
        name: 'Petit déjeuner (15€/personne/jour)', // Description de l'option
        quantity: guests * nights, // Quantité (nombre de personnes multiplié par le nombre de nuits)
        price: 15, // Prix par personne par jour
        total: breakfastTotal // Total pour l'option petit déjeuner
    });
}

// Option Repas
if (data.meal === '25' && data.mealType !== 'ponctuel') { 
    // Si l'utilisateur a sélectionné l'option repas (25€/personne) et que le type de repas n'est pas "ponctuel"
    const guests = parseInt(data.guests); // Nombre d'invités (en convertissant le nombre de personnes en entier)
    const mealTotal = 25 * guests; // Calcul du coût total du repas (25€/personne)
    total += mealTotal; // Ajouter le coût du repas au total général
    invoiceItems.push({ // Ajouter cet élément à la facture
        name: `Repas (25€/personne) - ${data.mealType}`, // Description de l'option, incluant le type de repas
        quantity: guests, // Quantité (nombre de personnes)
        price: 25, // Prix par personne
        total: mealTotal // Total pour l'option repas
    });
}

// Option Visite guidée
if (data.tour === '20') { 
    // Si l'utilisateur a sélectionné l'option visite guidée (20€)
    total += 20; // Ajouter le coût de la visite guidée au total général
    invoiceItems.push({ // Ajouter cet élément à la facture
        name: 'Visite guidée', // Description de l'option
        quantity: 1, // Quantité (une seule visite guidée)
        price: 20, // Prix de la visite guidée
        total: 20 // Total pour l'option visite guidée
    });
}

        
// Afficher les détails de la réservation
//Détails du séjour
//Options
confirmationDetails.innerHTML = `
    <h3>Informations Personnelles</h3>
    <p><strong>Nom:</strong> ${data.lastName} ${data.firstName}</p>
    <p><strong>Adresse:</strong> ${data.streetNumber} ${data.streetName}, ${data.postalCode} ${data.city}</p>
    <p><strong>Contact:</strong> ${data.email} / ${data.phone}</p>
   
    <h3>Détails du séjour</h3>
    <p><strong>Hébergement:</strong> ${data.hotel === 'igloo' ? 'Igloo' : 'Suite grotte'}</p>
    <p><strong>Nombre de personnes:</strong> ${data.guests}</p>
    <p><strong>Dates:</strong> du ${formatDate(data.arrivalDate)} au ${formatDate(data.departureDate)} (${nights} nuit${nights > 1 ? 's' : ''})</p>
    
    <h3>Options</h3>
    <p>${data.driver === '11' ? ' Chauffeur' : ' Chauffeur'}</p>
    <p>${data.breakfast === '15' ? ' Petit déjeuner' : ' Petit déjeuner'}</p>
    <p>${data.meal === '25' ? ' Repas (' + data.mealType + ')' : ' Repas'}</p>
    <p>${data.tour === '20' ? ' Visite guidée' : ' Visite guidée'}</p>
`;

// Affiche le details de la facture
let invoiceHTML = '<h3>Détail de la facture</h3><table class="invoice-table"><tr><th>Description</th><th>Quantité</th><th>Prix unitaire</th><th>Total</th></tr>';
// Pour chaque article dans la liste des éléments de la facture, générer une ligne de table
invoiceItems.forEach(item => {
    invoiceHTML += `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price}€</td>
            <td>${item.total}€</td>
        </tr>
    `;
});
// Ajouter une ligne pour afficher le total général de la facture
invoiceHTML += `
    <tr class="total-row">
        <td colspan="3"><strong>Total</strong></td>
        <td><strong>${total}€</strong></td>
    </tr>
</table>
`;
// Insertion du contenu de la facture dans le HTML
invoiceDetails.innerHTML = invoiceHTML;

// Affiche la modal avec la confirmation et les détails
modal.style.display = 'block';
}

// Formater la date
function formatDate(dateString) {
const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
return new Date(dateString).toLocaleDateString('fr-FR', options);
}
});


//////////////////////////////// BONUS MODE NUIT /////////////////////////////////////////

// Sélectionnez le bouton de basculement
const themeToggleButton = document.getElementById('theme-toggle');

// Vérifiez si un mode est stocké dans localStorage (pour préserver la préférence de l'utilisateur)
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    themeToggleButton.innerHTML = '🌞 dark'; // Texte pour basculer vers mode jour
} else {
    document.body.classList.remove('dark-mode');
    themeToggleButton.innerHTML = '🌙 dark'; // Texte pour basculer vers mode nuit
}

// Ajouter un écouteur d'événements pour le bouton
themeToggleButton.addEventListener('click', () => {
    // Basculez la classe 'dark-mode' sur le body
    document.body.classList.toggle('dark-mode');
    
    // Sauvegardez la préférence dans localStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'true');
        themeToggleButton.innerHTML = '🌞 dark'; // Texte pour mode jour
    } else {
        localStorage.setItem('darkMode', 'false');
        themeToggleButton.innerHTML = '🌙 dark '; // Texte pour mode nuit
    }
});
