package beans;

import java.util.HashMap;

public class BazaPodataka {
	private HashMap<String, Korisnik> korisnici;
	private HashMap<String, Organizacija> organizacije;
	private HashMap<String, VM> virtualeMasine;
	
	public BazaPodataka() {
		this.korisnici = new HashMap<String, Korisnik>();
		this.organizacije = new HashMap<String, Organizacija>();
		this.virtualeMasine = new HashMap<String, VM>();
	}
	
	public void dodajOrganizaciju(Organizacija o) {
		this.organizacije.put(o.getIme(), o);
	}
	public Organizacija nadjiOrganizaciju(String ime) {
		if (this.organizacije.containsKey(ime)) {
			return this.organizacije.get(ime);
		}
		else
			return null;
	}
	public String izmeniOrganizaciju(String ime,String opis,String logo) {
		String poruka = "";
		Organizacija o = this.nadjiOrganizaciju(ime);
		if(o!=null) {
			poruka = "Organizacija sa imenom " + ime + " vec postoji!";
		}
		else {
			o.setIme(ime);
			o.setLogo(logo);
			o.setOpis(opis);
		}
		return poruka;
	}
	
}
