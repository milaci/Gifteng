/**
 * 
 */
package com.venefica.services;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Hashtable;
import java.util.Vector;

import org.ksoap2.serialization.KvmSerializable;
import org.ksoap2.serialization.PropertyInfo;
import org.ksoap2.serialization.SoapSerializationEnvelope;

import android.util.Log;

import com.venefica.module.user.UserDto;
import com.venefica.utils.Constants;


/**
 * @author avinash
 *
 */
public class RequestDto implements KvmSerializable {

	enum RequestStatus {
	    
	    PENDING, //REQUESTED - giver didn't make a decision
	    EXPIRED, //REJECTED - if someone else selected
	    ACCEPTED, //selected
	    ;
	}
	private Long id;
    private Long adId;
    private UserDto user;
    private Date requestedAt;
    private RequestStatus status;
	/* (non-Javadoc)
	 * @see org.ksoap2.serialization.KvmSerializable#getProperty(int)
	 */
	@Override
	public Object getProperty(int index) {
		switch (index) {
		case 0:
			return id;
		case 1:
			return adId;
		case 2:
			return user;
		case 3:
			return requestedAt != null ? requestedAt.getTime() : 0;
		case 4:
			if (status != null)
				return status.name();
			else
				return null;
		}
		return null;
	}

	/* (non-Javadoc)
	 * @see org.ksoap2.serialization.KvmSerializable#getPropertyCount()
	 */
	@Override
	public int getPropertyCount() {
		// TODO Auto-generated method stub
		return 5;
	}

	@Override
	public void setProperty(int index, Object value) {
		try
		{
			switch (index)
			{
				case 0:
					id = Long.valueOf(value.toString());
					break;
				case 1:
					adId = Long.valueOf(value.toString());
					break;
				case 2:
					user = (UserDto)value;
					break;
				case 3:
					requestedAt = new Date(Long.parseLong(value.toString()));
					break;
				case 4:
					status = RequestStatus.valueOf(value.toString());
					break;				
			}
		}
		catch (Exception e)
		{
			Log.d("AdDto.setProperty Exception:", e.getLocalizedMessage());
		}
	}

	/* (non-Javadoc)
	 * @see org.ksoap2.serialization.KvmSerializable#getPropertyInfo(int, java.util.Hashtable, org.ksoap2.serialization.PropertyInfo)
	 */
	@Override
	public void getPropertyInfo(int index, @SuppressWarnings ("rawtypes") Hashtable properties, PropertyInfo info) {
		switch (index)
		{
			case 0:
				info.name = "id";
				info.type = Long.TYPE;
				break;
			case 1:
				info.name = "adId";
				info.type = Long.TYPE;
				break;
			case 2:
				info.name = "user";
				info.type = UserDto.class;
				break;
			case 3:
				info.name = "requestedAt";
				info.type = Long.class;
				break;
			case 4:
				info.name = "status";
				info.type = RequestStatus.class;
				break;
		}
	}
	public void register(SoapSerializationEnvelope envelope)
	{
		envelope.addMapping(Constants.SERVICES_NAMESPACE, this.getClass().getName(), this.getClass());
	}

	public void registerRead(SoapSerializationEnvelope envelope)
	{
		envelope.addMapping(null, "UserDto", this.getClass());
	}
	/**
	 * @return the id
	 */
	public Long getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * @return the adId
	 */
	public Long getAdId() {
		return adId;
	}

	/**
	 * @param adId the adId to set
	 */
	public void setAdId(Long adId) {
		this.adId = adId;
	}

	/**
	 * @return the user
	 */
	public UserDto getUser() {
		return user;
	}

	/**
	 * @param user the user to set
	 */
	public void setUser(UserDto user) {
		this.user = user;
	}

	/**
	 * @return the requestedAt
	 */
	public Date getRequestedAt() {
		return requestedAt;
	}

	/**
	 * @param requestedAt the requestedAt to set
	 */
	public void setRequestedAt(Date requestedAt) {
		this.requestedAt = requestedAt;
	}

	/**
	 * @return the status
	 */
	public RequestStatus getStatus() {
		return status;
	}

	/**
	 * @param status the status to set
	 */
	public void setStatus(RequestStatus status) {
		this.status = status;
	}

}
