package beans;

import java.util.Date;

public class Aktivnost {
	private Date upaljena;
	private Date ugasena;
	
	public Aktivnost() {
		
	}
	public Aktivnost(Date upaljena){
		this.upaljena = upaljena;
		this.ugasena = null;
	}

	public Aktivnost(Date upaljena, Date ugasena) {
		super();
		this.upaljena = upaljena;
		this.ugasena = ugasena;
	}
	public Date getUpaljena() {
		return upaljena;
	}
	public void setUpaljena(Date upaljena) {
		this.upaljena = upaljena;
	}
	public Date getUgasena() {
		return ugasena;
	}
	public void setUgasena(Date ugasena) {
		this.ugasena = ugasena;
	}
	
}
